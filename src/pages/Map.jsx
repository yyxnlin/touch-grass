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

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [directions, setDirections] = useState(null);

  // Hardcoded origin and destination
  const origin = { lat: 43.65972, lng: -79.396629 };
  const destination = { lat: 43.6426, lng: -79.3871 };

  // Fetch route from Google Maps Directions API
  useEffect(() => {
    if (!isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading map...</div>;

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
