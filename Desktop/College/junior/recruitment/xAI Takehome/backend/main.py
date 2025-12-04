import os
import json
from typing import List
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from models import Lead, LeadCreate, Activity
from services.grok import GrokService

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
    allow_origins=["http://localhost:5173"],
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
        # Total Leads
        total_leads = supabase.table("leads").select("*", count="exact", head=True).execute().count
        
        # Qualified Leads
        qualified_leads = supabase.table("leads").select("*", count="exact", head=True).eq("stage", "qualified").execute().count
        
        # Messages (Activities of type email/message)
        # Note: Supabase-py 'or' filter syntax is a bit tricky, doing separate counts for simplicity or raw query
        emails = supabase.table("activities").select("*", count="exact", head=True).eq("type", "email").execute().count
        messages = supabase.table("activities").select("*", count="exact", head=True).eq("type", "message").execute().count
        total_messages = (emails or 0) + (messages or 0)
        
        # Meetings
        meetings = supabase.table("activities").select("*", count="exact", head=True).eq("type", "meeting").execute().count

        # 2. Pipeline Stages
        # We need counts for: New, Contacted, Qualified, Proposal, Closed
        stages = ["new", "contacted", "qualified", "proposal", "closed"]
        pipeline_stats = []
        for stage in stages:
            count = supabase.table("leads").select("*", count="exact", head=True).eq("stage", stage).execute().count
            pipeline_stats.append({"name": stage, "count": count or 0})

        # 3. Recent Activity
        recent_activities = supabase.table("activities").select("*").order("created_at", desc=True).limit(5).execute().data

        return {
            "metrics": {
                "total_leads": total_leads,
                "qualified_leads": qualified_leads,
                "messages_sent": total_messages,
                "meetings_booked": meetings
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
        
        # Update lead with new score/stage
        supabase.table("leads").update({
            "score": result.get("score", 0),
            "stage": result.get("stage", "new")
        }).eq("id", lead_data["id"]).execute()
        
        # Log the activity
        supabase.table("activities").insert({
            "lead_id": lead_data["id"],
            "type": "analysis",
            "action": f"Grok Qualification: {result.get('reasoning', 'Scored lead')}",
            "grok_generated": True
        }).execute()
        
    except Exception as e:
        print(f"Background qualification failed: {e}")

# --- EVALUATION ---

@app.post("/evaluate")
async def run_model_evaluation():
    """
    Runs the full evaluation suite against the test dataset.
    This might take time, so in a real app we'd use a job queue,
    but async is fine for this scale.
    """
    try:
        # Load test data
        with open("backend/data/lead_eval_set.json", "r") as f:
            test_cases = json.load(f)
            
        results = await grok.run_evaluation(
            test_cases=test_cases, 
            models=["grok-beta"] # Add more models here as available
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
