from pydantic import BaseModel
from typing import List, Optional

class MovieBase(BaseModel):
    id: int
    title: str
    overview: str
    poster_path: Optional[str] = None

class MovieRecommendation(MovieBase):
    pass
