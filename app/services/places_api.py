import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def get_nearby_pois(lat, lng, place_type="park|cafe|tourist_attraction", radius=500, max_results=3):
    url = (
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        f"?location={lat},{lng}"
        f"&radius={radius}"
        f"&type={place_type}"
        f"&key={API_KEY}"
    )
    response = requests.get(url).json()
    print(response)
    results = response.get("results", [])
    
    # Randomly pick max_results POIs
    selected_pois = results[:max_results]  # for now, pick first N
    pois = []
    for poi in selected_pois:
        pois.append({
            "name": poi.get("name"),
            "lat": poi["geometry"]["location"]["lat"],
            "lng": poi["geometry"]["location"]["lng"],
        })
    return pois
