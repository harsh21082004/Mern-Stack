import  { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const ProtectedHome = () => {
    if (isLoggedIn) {
      return <Home />;
    } else {
      alert('You are not logged in, please log in first!');
      return <Navigate to="/login" />;
    }
  };
  return (
    <div style={{ marginTop: '-3.5rem' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/home" element={<ProtectedHome/>} />
          <Route path="/students" element={<Home />} />
          <Route path="/attendance" element={<Home />} />
          <Route path="/attendance/:date" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
