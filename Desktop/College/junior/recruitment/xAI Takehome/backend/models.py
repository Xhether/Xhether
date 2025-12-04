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

# Properties to receive on creation
class LeadCreate(LeadBase):
    pass

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
