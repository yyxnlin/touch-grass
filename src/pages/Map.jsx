import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { touchGrassMapStyle } from "../mapStyles";
import bgImage from "../assets/landing-page/bg-image.png";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const backgroundStyles = {
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
};

// helper to extract params from hash (#/map?origin_lat=...)
function getHashParams() {
  const hash = window.location.hash; // "#/map?origin_lat=...&origin_lng=..."
  const queryStart = hash.indexOf("?");
  if (queryStart === -1) return {};
  const queryString = hash.substring(queryStart + 1); // "origin_lat=...&dest_lat=..."
  return Object.fromEntries(new URLSearchParams(queryString));
}

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [directions, setDirections] = useState(null);
  const [routeData, setRouteData] = useState(null);


  const params = getHashParams();
  const origin_lat = params.origin_lat;
  const origin_lng = params.origin_lng;
  const dest_lat = params.dest_lat;
  const dest_lng = params.dest_lng;

  const origin = { lat: origin_lat, lng: origin_lng };
  const destination = { lat: dest_lat, lng: dest_lng };

// Fetch origin/destination from backend
  useEffect(() => {
    if (!origin_lat || !origin_lng || !dest_lat || !dest_lng) return;
    async function fetchRoute() {
      try {
        const res = await fetch(
          `http://localhost:8000/route?origin_lat=${origin_lat}&origin_lng=${origin_lng}&dest_lat=${dest_lat}&dest_lng=${dest_lng}`
        // `http://localhost:8000/route?origin_lat=43.65972&origin_lng=-79.396629&dest_lat=43.6426&dest_lng=-79.3871`
        );
        const data = await res.json();
        setRouteData(data);
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    }
    fetchRoute();
  }, []);

  // Fetch route from Google Maps Directions API
  useEffect(() => {
    if (!isLoaded || !routeData) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: {
          lat: parseFloat(routeData.origin_lat ?? origin.lat),
          lng: parseFloat(routeData.origin_lng ?? origin.lng),
        },
        destination: {
          lat: parseFloat(routeData.dest_lat ?? destination.lat),
          lng: parseFloat(routeData.dest_lng ?? destination.lng),
        },
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result, status);
        }
      }
    );
  }, [isLoaded, routeData]);

  if (!isLoaded) return <div>Loading map...</div>;
  if (!routeData) return <div>Loading route...</div>;

  return (
    <main style={backgroundStyles} className="grow flex flex-col justify-center">
      <div className="p-4 w-screen max-w-full">
        <h1 className="text-2xl font-bold mb-4">touch grass...</h1>
        <div className="rounded-2xl overflow-hidden max-w-full">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={origin}
            zoom={14}
            options={{
              styles: touchGrassMapStyle,
            }}
          >
            {/* <Marker position={origin} label="S" /> */}
            {/* <Marker position={destination} label="D" /> */}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
      </div>
    </main>
  );
};

export default Map;
