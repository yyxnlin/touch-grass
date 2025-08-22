import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_MAPS_KEY")

def get_route(origin: str, destination: str, mode: str = "walking"):
    url = (
        f"https://maps.googleapis.com/maps/api/directions/json?"
        f"origin={origin}&destination={destination}&mode={mode}&key={API_KEY}"
    )
    response = requests.get(url)
    return response.json()
