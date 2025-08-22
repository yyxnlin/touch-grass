import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
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
    libraries: ["geometry"],
  });

  // Hardcoded origin and destination
  const origin = { lat: 43.65972, lng: -79.396629 };
  const destination = { lat: 43.6426, lng: -79.3871 };

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
            {/* Origin marker */}
            <Marker position={origin} label="S" />
            {/* Destination marker */}
            <Marker position={destination} label="D" />
          </GoogleMap>
        </div>
      </div>
    </main>
  );
};

export default Map;
