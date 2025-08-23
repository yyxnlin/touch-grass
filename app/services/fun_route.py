from app.services.maps_api import get_route
from app.services.places_api import get_nearby_pois
from polyline import decode as decode_polyline
import random
from math import radians, cos, sin, sqrt, atan2


def distance_m(lat1, lng1, lat2, lng2):
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return c


def get_fun_waypoints(origin, destination, max_waypoints=4):
    # get walking route
    route_data = get_route(origin, destination, mode="walking")
    polyline = route_data["routes"][0]["overview_polyline"]["points"]
    path_coords = decode_polyline(polyline)

    fun_waypoints = []

    # sample every 5 steps along the route (find fun stuff along the way)
    sample_points = path_coords[::5]

    for lat, lng in sample_points:
        # CHANGE THIS if you want different side quest results
        pois = get_nearby_pois(
            lat, lng,
            radius=400,
            types=["tourist_attraction", "park"], # or ["restaurant", "cafe", "museum"]
            min_rating=3
        )

        # pick at most 1 POI per segment to avoid backtracking 
        # (probably can change this later to a better method, because right now if the radius is too large then it still goes crazy)
        if pois:
            chosen = random.choice(pois)
            fun_waypoints.append({
                "name": chosen["name"],
                "lat": chosen["lat"],
                "lng": chosen["lng"]
            })

    # remove duplicates while preserving order
    seen = set()
    unique_list = []
    for w in fun_waypoints:
        key = (w["lat"], w["lng"])
        if key not in seen:
            seen.add(key)
            unique_list.append(w)
    print(unique_list)
    # limit to max_waypoints (random)
    if len(unique_list) > max_waypoints:
        unique_list = random.sample(unique_list, max_waypoints)

    # Assign each waypoint a position along the route
    for w in unique_list:
        # compute distance to each polyline point
        distances = [distance_m(w["lat"], w["lng"], lat, lng) for lat, lng in path_coords]
        w["route_index"] = distances.index(min(distances))  # index of closest point

    # Sort waypoints by their route_index (so that you hopefully don't loop back and forth)
    unique_list.sort(key=lambda w: w["route_index"])

    return unique_list
