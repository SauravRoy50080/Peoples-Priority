from pydantic import BaseModel
from typing import Optional
from enum import Enum

# it is used to validate the responses of the ai 
class Entities(BaseModel):
    issue_type: Optional[str]
    facility: Optional[str]
    duration: Optional[str]
    location_mentioned: Optional[str]

class Category(str, Enum):
    ROAD = "Road"
    WATER = "Water"
    HEALTHCARE = "Healthcare"
    EDUCATION = "Education"
    ELECTRICITY = "Electricity"
    AGRICULTURE = "Agriculture"
    SANITATION = "Sanitation"
    HOUSING = "Housing"
    TRANSPORT = "Transport"
    OTHER = "Other"

class Urgency(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class ComplaintResponse(BaseModel):
    category: Category
    urgency: Urgency
    summary: str
    entities: Entities