import os
import json
from typing import List
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from models import Lead, LeadCreate, LeadUpdate, Activity
from services.grok import GrokService
from pydantic import BaseModel

load_dotenv()

# Initialize Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Initialize Grok
grok = GrokService()

app = FastAPI(title="xAI Takehome API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000", 
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Lead Management API Active"}

# --- DASHBOARD ---

@app.get("/dashboard")
def get_dashboard_stats():
    try:
        # 1. Metrics
        total_leads = supabase.table("leads").select("*", count="exact", head=True).execute().count
        
        qualified_leads = supabase.table("leads").select("*", count="exact", head=True).eq("stage", "qualified").execute().count
        
        emails = supabase.table("activities").select("*", count="exact", head=True).eq("type", "email").execute().count
        messages = supabase.table("activities").select("*", count="exact", head=True).eq("type", "message").execute().count
        total_messages = (emails or 0) + (messages or 0)
        
        meetings = supabase.table("activities").select("*", count="exact", head=True).eq("type", "meeting").execute().count

        # New metrics
        notified_leads = supabase.table("leads").select("*", count="exact", head=True).eq("notification_sent", True).execute().count
        responded_leads = supabase.table("leads").select("*", count="exact", head=True).eq("response_received", True).execute().count

        # 2. Pipeline Stages
        stages = ["new", "contacted", "qualified", "engaged", "proposal", "closed"]  # Added engaged
        pipeline_stats = []
        for stage in stages:
            count = supabase.table("leads").select("*", count="exact", head=True).eq("stage", stage).execute().count
            pipeline_stats.append({"name": stage, "count": count or 0})

        # 3. Recent Activity
        recent_activities = supabase.table("activities").select("*, leads(company, contact)").order("created_at", desc=True).limit(5).execute().data

        return {
            "metrics": {
                "total_leads": total_leads,
                "qualified_leads": qualified_leads,
                "messages_sent": total_messages,
                "meetings_booked": meetings,
                "notified_leads": notified_leads or 0,
                "responded_leads": responded_leads or 0
            },
            "pipeline": pipeline_stats,
            "recent_activities": recent_activities
        }
    except Exception as e:
        print(f"Dashboard Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- LEADS ---

@app.get("/leads", response_model=List[Lead])
def get_leads():
    """Fetches all leads from Supabase. Efficiently selects only needed columns."""
    try:
        # Using select("*") is okay for small datasets, but for 'lots of data' 
        # we might want to implement pagination later.
        response = supabase.table("leads").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/leads/{lead_id}", response_model=Lead)
def get_lead(lead_id: str):
    try:
        response = supabase.table("leads").select("*").eq("id", lead_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Lead not found")

from models import Lead, LeadCreate, Activity, LeadUpdate

# ... imports ...

@app.delete("/leads/{lead_id}")
def delete_lead(lead_id: str):
    try:
        # Supabase delete requires a filter
        response = supabase.table("leads").delete().eq("id", lead_id).execute()
        if not response.data:
             # If no data returned, check if it existed or just successful empty
             # Assuming standard Supabase behavior
             pass
        return {"message": "Lead deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/leads/{lead_id}", response_model=Lead)
def update_lead(lead_id: str, lead_update: LeadUpdate, background_tasks: BackgroundTasks):
    try:
        # Filter out None values to only update provided fields
        update_data = {k: v for k, v in lead_update.model_dump().items() if v is not None}
        
        response = supabase.table("leads").update(update_data).eq("id", lead_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Lead not found")
            
        updated_lead = response.data[0]

        # Trigger re-scoring if critical fields changed
        # We check if company, industry, or employees are in the update_data
        if any(k in update_data for k in ["company", "industry", "employees"]):
            background_tasks.add_task(qualify_lead_background, updated_lead)
            
        return updated_lead
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/leads", response_model=Lead)
async def create_lead(lead: LeadCreate, background_tasks: BackgroundTasks):
    """
    Creates a lead and triggers an async Grok qualification in the background
    to keep the UI snappy.
    """
    try:
        # 1. Insert initial lead
        lead_data = lead.model_dump()
        lead_data["score"] = 0 # Default until Grok runs
        response = supabase.table("leads").insert(lead_data).execute()
        new_lead = response.data[0]

        # 2. Schedule Grok qualification in background
        background_tasks.add_task(qualify_lead_background, new_lead)
        
        return new_lead
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def qualify_lead_background(lead_data: dict):
    """Background task to score a lead and update DB."""
    try:
        result = await grok.qualify_lead(lead_data)
        
        # Update lead with new score/stage/insights
        update_data = {
            "score": result.get("score", 0),
            "stage": result.get("stage", "new"),
            "insights": result.get("insights", [])
        }
        supabase.table("leads").update(update_data).eq("id", lead_data["id"]).execute()
        
        # Log the activity
        supabase.table("activities").insert({
            "lead_id": lead_data["id"],
            "type": "analysis",
            "action": f"Grok Qualification: {result.get('reasoning', 'Scored lead')}",
            "grok_generated": True
        }).execute()
        
    except Exception as e:
        print(f"Background qualification failed: {e}")

@app.post("/leads/notify")
async def notify_leads(lead_ids: List[str], background_tasks: BackgroundTasks):
    """
    Notify selected qualified leads with Grok-generated messages.
    """
    try:
        notified = []
        for lead_id in lead_ids:
            # Fetch lead
            lead_response = supabase.table("leads").select("*").eq("id", lead_id).single().execute()
            if not lead_response.data or lead_response.data.get("stage") != "qualified":
                continue  # Skip non-qualified
            
            lead_data = lead_response.data
            
            # Generate message with Grok (background for speed)
            background_tasks.add_task(generate_and_log_notification, lead_id, lead_data)
            notified.append(lead_id)
        
        return {"notified": len(notified), "lead_ids": notified}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def generate_and_log_notification(lead_id: str, lead_data: dict):
    """
    Background task: Generate message, update lead, log activity.
    """
    try:
        message_result = await grok.generate_notification_message(lead_data)
        
        # Update lead: Mark as notified
        supabase.table("leads").update({"notification_sent": True}).eq("id", lead_id).execute()
        
        # Log activity
        supabase.table("activities").insert({
            "lead_id": lead_id,
            "type": "notification",
            "action": f"Sent: {message_result.get('subject', 'Outreach Email')}",
            "grok_generated": True,
            "details": json.dumps(message_result)  # Store full message for later
        }).execute()
        
        print(f"Notification sent for lead {lead_id}")
    except Exception as e:
        print(f"Notification failed for {lead_id}: {e}")

# Add PATCH for marking response
@app.patch("/leads/{lead_id}/respond")
def mark_response_received(lead_id: str):
    try:
        response = supabase.table("leads").update({"response_received": True, "stage": "engaged"}).eq("id", lead_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Log activity
        supabase.table("activities").insert({
            "lead_id": lead_id,
            "type": "response",
            "action": "Lead responded to notification",
            "grok_generated": False
        }).execute()
        
        return {"message": "Marked as responded"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- EVALUATION ---

@app.post("/evaluate")
async def run_model_evaluation():
    """
    Runs the full evaluation suite against the test dataset.
    """
    try:
        # Load test data
        with open("data/lead_eval_set.json", "r") as f:
            test_cases = json.load(f)
            
        evaluation = await grok.run_evaluation(
            test_cases=test_cases, 
            models=["grok-3", "grok-4-fast-reasoning", "grok-4-fast-non-reasoning"]  # Specific models requested
        )
        return evaluation  # Returns {"results": {...}, "failures": [...]}
    except Exception as e:
        print(f"Evaluation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Add after /leads endpoints

from typing import List
from pydantic import BaseModel

class MessageGenerate(BaseModel):
    lead_id: str
    tone: str = "professional"
    goal: str = "schedule_meeting"
    model: str = "grok-4-fast-reasoning"

@app.get("/leads/{lead_id}/messages")
def get_lead_messages(lead_id: str):
    try:
        response = supabase.table("activities").select("*").eq("lead_id", lead_id).order("created_at", desc=True).execute()
        return {"messages": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/messages/generate")
async def generate_message(request: MessageGenerate):
    try:
        # Fetch lead
        lead_response = supabase.table("leads").select("*").eq("id", request.lead_id).single().execute()
        if not lead_response.data:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        lead_data = lead_response.data
        message_result = await grok.generate_notification_message(lead_data, model=request.model)  # Reuse or adapt
        
        # Insert as activity
        activity_data = {
            "lead_id": request.lead_id,
            "type": "message",
            "action": f"Generated: {message_result.get('subject', 'AI Message')}",
            "grok_generated": True,
            "details": json.dumps({
                "tone": request.tone,
                "goal": request.goal,
                "subject": message_result.get('subject'),
                "body": message_result.get('body'),
                "reasoning": message_result.get('reasoning')
            })
        }
        supabase.table("activities").insert(activity_data).execute()
        
        return {
            "success": True,
            "message": message_result,
            "activity_id": activity_data.get('id')  # If auto-generated
        }
    except Exception as e:
        print(f"Message generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))