from fastapi import APIRouter, Query
from app.services.maps_api import get_route

router = APIRouter()

@router.get("/route")
def generate_route(
    origin: str = Query(..., description="Start location"),
    destination: str = Query(..., description="End location"),
    mode: str = "walking"
):
    data = get_route(origin, destination, mode)
    return {"origin": origin, "destination": destination, "mode": mode, "data": data}
