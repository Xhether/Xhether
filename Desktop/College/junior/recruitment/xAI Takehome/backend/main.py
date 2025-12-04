from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import Lead, LeadCreate

app = FastAPI(title="xAI Takehome API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Lead Management API"}

@app.get("/leads", response_model=list[Lead])
def get_leads():
    # TODO: Fetch from Supabase
    return []

@app.post("/leads", response_model=Lead)
def create_lead(lead: LeadCreate):
    # TODO: Insert into Supabase
    return lead

