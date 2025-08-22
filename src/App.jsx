import { useState } from 'react'

// Pages
import {HashRouter, Routes, Route} from 'react-router-dom'
import LandingPage from "./pages/LandingPage"
import Login from './pages/Login'
import Signup from './pages/Signup'

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
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </HashRouter>
  )
}

export default App;