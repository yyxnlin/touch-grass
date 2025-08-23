import requests
import os

GOOGLE_API_KEY = os.environ.get("GOOGLE_MAPS_KEY")
print("Loaded API key:", GOOGLE_API_KEY)

def get_nearby_pois(lat, lng, radius=50, types=None, min_rating=0):
    """
    Return POIs near lat/lng using Google Places API.

    Args:
        lat, lng: center point
        radius: search radius in meters
        types: list of place types, e.g. ["tourist_attraction", "park", "museum"]
        min_rating: minimum Google rating to include
    Returns:
        List of dicts: {name, lat, lng, type, rating}
    """
    if types is None:
        types = ["tourist_attraction", "park", "museum"]

    all_pois = []

    for place_type in types:
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "key": GOOGLE_API_KEY,
            "location": f"{lat},{lng}",
            "radius": radius,
            "type": place_type,
        }
        resp = requests.get(url, params=params)
        data = resp.json()
        # print(resp.url)
        # print(data)   

        for result in data.get("results", []):
            rating = result.get("rating", 0)
            if rating >= min_rating:
                poi = {
                    "name": result["name"],
                    "lat": result["geometry"]["location"]["lat"],
                    "lng": result["geometry"]["location"]["lng"],
                    "type": place_type,
                    "rating": rating,
                }
                all_pois.append(poi)
    # print(all_pois)
    return all_pois
