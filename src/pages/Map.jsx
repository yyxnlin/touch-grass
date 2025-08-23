// (delete later)
// here are some ones you can try:
// http://localhost:5173/#/map?origin_lat=43.897991&origin_lng=-79.303107&dest_lat=43.853169&dest_lng=-79.311275 (markham)
// http://localhost:5173/#/map?origin_lat=43.65972&origin_lng=-79.396629&dest_lat=45.6426&dest_lng=-79.3871 (toronto)

import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { touchGrassMapStyle } from "../mapStyles";
import bgImage from "../assets/landing-page/bg-image.png";

const containerStyle = { width: "100%", height: "600px" };
const backgroundStyles = { backgroundImage: `url(${bgImage})`, backgroundSize: "cover" };

// helper to extract params from hash (#/map?origin_lat=...)
function getHashParams() {
  const hash = window.location.hash;
  const queryStart = hash.indexOf("?");
  if (queryStart === -1) return {};
  const queryString = hash.substring(queryStart + 1);
  return Object.fromEntries(new URLSearchParams(queryString));
}

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [directions, setDirections] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [distance, setDistance] = useState(0);

  const params = getHashParams();
  const origin_lat = params.origin_lat;
  const origin_lng = params.origin_lng;
  const dest_lat = params.dest_lat;
  const dest_lng = params.dest_lng;

  // Parse origin/destination from params
  const origin = { lat: parseFloat(origin_lat), lng: parseFloat(origin_lng) };
  const destination = { lat: parseFloat(dest_lat), lng: parseFloat(dest_lng) };

  // Fetch route + waypoints from backend once
  useEffect(() => {
  if (!origin_lat || !origin_lng || !dest_lat || !dest_lng) return;

  async function fetchFunRoute() {
    try {
      const url = `http://localhost:8000/funroute?origin_lat=${origin_lat}&origin_lng=${origin_lng}&dest_lat=${dest_lat}&dest_lng=${dest_lng}`;
      console.log("Fetching backend URL:", url);

      const res = await fetch(url);
      const data = await res.json();
      console.log("Got route data:", data);

      setRouteData(data);
      if (data.waypoints) setWaypoints(data.waypoints);
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  }

  fetchFunRoute();
}, [origin_lat, origin_lng, dest_lat, dest_lng]);

  // Only fetch directions when map is loaded and routeData exists
  useEffect(() => {
    if (!isLoaded || !routeData) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: routeData.origin,
        destination: routeData.destination,
        travelMode: window.google.maps.TravelMode.WALKING,
        waypoints: (routeData.waypoints || []).map((wp) => ({ location: { lat: wp.lat, lng: wp.lng }, stopover: true })),
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);

          // calculate total distance
          let total = 0;
          result.routes[0].legs.forEach((leg) => {
            total += leg.distance.value; // distance in meters
          });
          setDistance(total);

        } else {
          console.error("Error fetching directions", result, status);
        }
      }
    );
  }, [isLoaded, routeData]);

  if (!isLoaded) return <div>Loading map...</div>;
  if (!directions) return <div>Loading route...</div>;

  return (
    <main style={backgroundStyles} className="grow flex flex-col justify-center">
      <div className="p-4 w-screen max-w-full">
        <h1 className="text-2xl font-bold mb-4">touch grass...</h1>
        {distance > 0 && <p>Total distance: {(distance / 1000).toFixed(2)} km</p>}
        <div className="rounded-2xl overflow-hidden max-w-full">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={origin}
            zoom={14}
            options={{ styles: touchGrassMapStyle }}
          >
            {directions && <DirectionsRenderer directions={directions} />}
            {/* {(routeData?.waypoints || []).map((wp, i) => (
              <Marker key={i} position={{ lat: wp.lat, lng: wp.lng }} label={wp.name} />
            ))} */}
          </GoogleMap>
        </div>
      </div>
    </main>
  );
};

export default Map;
