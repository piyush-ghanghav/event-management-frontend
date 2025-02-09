import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import GuestLogin from "./pages/GuestLogin";
import Dashboard from "./pages/Dashboard";
import EventDetail from "./pages/EventDetail";
import EventForm from "./pages/EventForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/guest" element={<GuestLogin />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event/new" element={<EventForm />}></Route>
        <Route path="/event/:id" element={<EventDetail />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
