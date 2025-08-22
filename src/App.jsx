import { useState } from 'react'

// Pages
import {HashRouter, Routes, Route} from 'react-router-dom'
import LandingPage from "./pages/LandingPage"
import Login from './pages/Login'
import Signup from './pages/Signup'
import Map from './pages/Map'

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </HashRouter>
  )
}

export default App
