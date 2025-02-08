import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventForm from './pages/EventForm';
import EventDetail from './pages/EventDetail';
import LandingPage from './pages/LandingPage';
import GuestLogin from './pages/GuestLogin';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path = '/event/new' element={<EventForm />}></Route>
      <Route path = '/event/:id' element={<EventDetail />}></Route>
      <Route path = '/guest' element={<GuestLogin />}></Route>
    </Routes>
    </Router>
  );
}

export default App;
