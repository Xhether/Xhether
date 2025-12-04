import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime, timedelta

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in environment.")
    exit(1)

supabase: Client = create_client(url, key)

async def seed_data():
    print("Starting seed process...")

    # 1. Clear existing data (optional, be careful in prod)
    # Note: Cascade delete on leads will clear activities too
    # This is a bit aggressive, but fine for dev
    try:
        print("Clearing existing leads...")
        # We have to fetch IDs first to delete them because Supabase-py delete requires a filter
        # Or use a wide filter.
        leads = supabase.table("leads").select("id").execute()
        for lead in leads.data:
            supabase.table("leads").delete().eq("id", lead["id"]).execute()
    except Exception as e:
        print(f"Error clearing data: {e}")

    # 2. Insert Leads
    leads_data = [
        {
            "company": "Acme Corporation",
            "contact": "John Smith",
            "email": "john@acme.com",
            "score": 92,
            "stage": "qualified",
            "value": "$45,000",
            "last_contact": (datetime.now() - timedelta(days=2)).isoformat(),
            "industry": "Technology"
        },
        {
            "company": "TechStart Inc",
            "contact": "Sarah Johnson",
            "email": "sarah@techstart.com",
            "score": 85,
            "stage": "contacted",
            "value": "$32,000",
            "last_contact": (datetime.now() - timedelta(days=1)).isoformat(),
            "industry": "Software"
        },
        {
            "company": "Innovate Labs",
            "contact": "Michael Chen",
            "email": "michael@innovatelabs.com",
            "score": 78,
            "stage": "new",
            "value": "$58,000",
            "last_contact": (datetime.now() - timedelta(hours=3)).isoformat(),
            "industry": "Research"
        },
        {
            "company": "DataCo Solutions",
            "contact": "Emily Davis",
            "email": "emily@dataco.com",
            "score": 95,
            "stage": "proposal",
            "value": "$72,000",
            "last_contact": (datetime.now() - timedelta(days=5)).isoformat(),
            "industry": "Data Analytics"
        },
        {
            "company": "CloudTech Systems",
            "contact": "Robert Wilson",
            "email": "robert@cloudtech.com",
            "score": 88,
            "stage": "qualified",
            "value": "$38,000",
            "last_contact": (datetime.now() - timedelta(weeks=1)).isoformat(),
            "industry": "Cloud Services"
        },
        {
            "company": "Enterprise Co",
            "contact": "Lisa Anderson",
            "email": "lisa@enterpriseco.com",
            "score": 71,
            "stage": "contacted",
            "value": "$95,000",
            "last_contact": (datetime.now() - timedelta(days=4)).isoformat(),
            "industry": "Enterprise Software"
        }
    ]

    print(f"Inserting {len(leads_data)} leads...")
    inserted_leads = []
    for lead in leads_data:
        res = supabase.table("leads").insert(lead).execute()
        inserted_leads.append(res.data[0])

    # 3. Insert Activities
    activities_data = [
        {
            "lead_id": inserted_leads[0]["id"], # Acme
            "type": "email",
            "action": "Email sent to Acme Corp",
            "created_at": (datetime.now() - timedelta(minutes=5)).isoformat()
        },
        {
            "lead_id": inserted_leads[1]["id"], # TechStart
            "type": "call",
            "action": "Call scheduled with TechStart",
            "created_at": (datetime.now() - timedelta(minutes=23)).isoformat()
        },
        {
            "lead_id": inserted_leads[2]["id"], # Innovate
            "type": "meeting",
            "action": "Meeting completed with Innovate Inc",
            "created_at": (datetime.now() - timedelta(hours=1)).isoformat()
        },
        {
            "lead_id": inserted_leads[3]["id"], # DataCo
            "type": "message",
            "action": "LinkedIn message to DataCo",
            "created_at": (datetime.now() - timedelta(hours=2)).isoformat()
        },
        {
            "lead_id": inserted_leads[4]["id"], # CloudTech
            "type": "email",
            "action": "Follow-up sent to CloudTech",
            "created_at": (datetime.now() - timedelta(hours=3)).isoformat()
        }
    ]

    print(f"Inserting {len(activities_data)} activities...")
    for activity in activities_data:
        supabase.table("activities").insert(activity).execute()

    print("Seed completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())

