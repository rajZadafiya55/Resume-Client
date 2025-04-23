// src/routes/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if the user is authenticated

  // If authenticated, render the route, otherwise redirect to login
  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;
