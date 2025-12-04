from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Shared properties
class LeadBase(BaseModel):
    company: str
    contact: str
    email: str
    phone: Optional[str] = None
    stage: str = "new"
    value: str
    industry: Optional[str] = None
    employees: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    job_title: Optional[str] = None
    linkedin: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    insights: Optional[List[str]] = []
    notification_sent: Optional[bool] = False
    response_received: Optional[bool] = False

# Properties to receive on creation
class LeadCreate(LeadBase):
    pass

# Properties to receive on update
class LeadUpdate(BaseModel):
    company: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    stage: Optional[str] = None
    value: Optional[str] = None
    industry: Optional[str] = None
    employees: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    job_title: Optional[str] = None
    linkedin: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    insights: Optional[List[str]] = None
    notification_sent: Optional[bool] = None
    response_received: Optional[bool] = None
    
# Properties to return to client
class Lead(LeadBase):
    id: str
    score: int
    last_contact: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ActivityBase(BaseModel):
    type: str
    action: str
    grok_generated: bool = False
    timestamp: Optional[datetime] = None

class Activity(ActivityBase):
    id: str
    lead_id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
