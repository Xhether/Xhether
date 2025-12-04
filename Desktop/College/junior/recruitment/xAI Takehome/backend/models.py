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
    value: str  # stored as string in frontend, maybe decimal in DB
    industry: Optional[str] = None

# Properties to receive on creation
class LeadCreate(LeadBase):
    pass

# Properties to return to client
class Lead(LeadBase):
    id: str
    score: int
    last_contact: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ActivityBase(BaseModel):
    type: str
    action: str
    grok_generated: bool = False
    timestamp: datetime

class Activity(ActivityBase):
    id: str
    lead_id: str

    class Config:
        from_attributes = True

