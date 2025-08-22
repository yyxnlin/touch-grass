import React, { useState, useEffect } from "react";
import Map from "./components/Map";

function App() {
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    async function fetchRoute() {
      const res = await fetch(
        "http://localhost:8000/funroute?origin_lat=43.65972&origin_lng=-79.396629&destination=CN+Tower"
      );
      const data = await res.json();
      setRouteData(data);
    }
    fetchRoute();
  }, []);

  // Decode polyline points for Google Maps
  const decodePolyline = (encoded) => {
    const google = window.google;
    return google.maps.geometry.encoding.decodePath(encoded).map((p) => ({
      lat: p.lat(),
      lng: p.lng(),
    }));
  };

  const polylinePath =
    routeData?.route?.routes?.[0]?.overview_polyline?.points
      ? decodePolyline(routeData.route.routes[0].overview_polyline.points)
      : null;

  return (
    <div className="p-4 w-screen max-w-full">
      <h1 className="text-2xl font-bold mb-4">touch grass...</h1>
      <div className="rounded-2xl overflow-hidden max-w-full">
        <Map
          origin={{
            lat:
              routeData?.route?.routes?.[0]?.legs?.[0]?.end_location.lat || 43.65972,
            lng:
              routeData?.route?.routes?.[0]?.legs?.[0]?.end_location.lng || -79.396629,
          }}
          destination={{
            lat:
              routeData?.route?.routes?.[0]?.legs?.[0]?.end_location.lat || 43.6426,
            lng:
              routeData?.route?.routes?.[0]?.legs?.[0]?.end_location.lng || -79.3871,
          }}
          waypoints={routeData?.waypoints}
          polylinePath={polylinePath}
        />
      </div>
    </div>
  );
}

export default App;