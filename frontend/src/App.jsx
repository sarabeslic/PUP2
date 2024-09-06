// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dogs from  './pages/Dogs';
import Register from './pages/Register';
import DogProfile from './pages/DogProfile';
import HomePage from './pages/Homepage';
import Login from './pages/Login';
import UserPage from './pages/User';
import Settings from './pages/Settings';
import Matches from './pages/Matches';
import Bye from './pages/Bye';


const App = () => {
  return (
      <Router>
          <div>
              <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<HomePage />} />
                <Route path="/dogs" element={<Dogs />} />
                <Route path="/dogs/:id" element={<DogProfile />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/bye" element={<Bye />} />
              </Routes>
          </div>
      </Router>
  );
};

export default App;
