from fastapi import APIRouter, Query
from app.services.maps_api import get_route
from app.services.places_api import get_nearby_pois
import random
from polyline import decode as decode_polyline

router = APIRouter()

@router.get("/route")
def generate_route(
    origin: str = Query(..., description="Start location"),
    destination: str = Query(..., description="End location"),
    mode: str = "walking"
):
    data = get_route(origin, destination, mode)
    return {"origin": origin, "destination": destination, "mode": mode, "data": data}

@router.get("/funroute")
def fun_route(
    origin_lat: float,
    origin_lng: float,
    destination: str,
    mode: str = "walking",
    place_type: str = "park",
    num_pois: int = 3
):
    origin = f"{origin_lat},{origin_lng}"

    # 1️⃣ Get initial route without waypoints
    route_data = get_route(origin, destination, mode)

    # 2️⃣ Decode polyline to sample points along the route
    polyline_points = decode_polyline(route_data['routes'][0]['overview_polyline']['points'])
    sample_points = polyline_points[::max(1, len(polyline_points)//10)]  # ~10 points along route

    # 3️⃣ Query POIs along sampled points
    pois = []
    for point in sample_points:
        pois.extend(get_nearby_pois(point[0], point[1], place_type=place_type))

    # 4️⃣ Remove duplicates by lat/lng
    seen = set()
    unique_pois = []
    for poi in pois:
        key = (poi['lat'], poi['lng'])
        if key not in seen:
            seen.add(key)
            unique_pois.append(poi)

    # 5️⃣ Randomly pick final POIs for waypoints
    final_pois = random.sample(unique_pois, min(num_pois, len(unique_pois))) if unique_pois else []

    # 6️⃣ Build waypoints string for Directions API
    waypoints_str = "|".join([f"{poi['lat']},{poi['lng']}" for poi in final_pois]) if final_pois else None

    # 7️⃣ Get route with waypoints
    final_route = get_route(origin, destination, mode, waypoints_str)

    return {
        "origin": {"lat": origin_lat, "lng": origin_lng},
        "destination": destination,
        "waypoints": final_pois,
        "route": final_route
    }