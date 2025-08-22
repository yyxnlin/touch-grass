import React from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { touchGrassMapStyle } from "../mapStyles";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const Map = ({ origin, destination, waypoints, polylinePath }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry"],
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={origin || { lat: 43.6532, lng: -79.3832 }}
      zoom={13}
      options={{
        styles: touchGrassMapStyle, 
      }}
    >
      {/* Origin */}
      {origin && <Marker position={origin} label="start" />}
      {/* Destination */}
      {destination && <Marker position={destination} label="end" />}
      {/* Waypoints */}
      {waypoints &&
        waypoints.map((poi, index) => (
          <Marker
            key={index}
            position={{ lat: poi.lat, lng: poi.lng }}
            label={poi.name}
          />
        ))}
      {/* Polyline */}
      {polylinePath && (
        <Polyline
          path={polylinePath}
          options={{ strokeColor: "#0096aaff", strokeWeight: 4 }}
        />
      )}
    </GoogleMap>
  );
};

export default Map;
