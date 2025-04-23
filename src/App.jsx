// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Dashboard from './components/Dashboard';
// import ResumeForm from './components/ResumeForm';
// import Login from './components/Login';
// import Register from './components/Register';
// import Navbar from './components/Navbar';
// import PrivateRoute from './routes/PrivateRoute';
// import './App.css';

// const App = () => {
//   return (
//     <Router>
//       <Navbar />
//       <div className="App">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Use PrivateRoute for protected routes */}
//           <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
//           <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
//           <Route path="/create-resume" element={<PrivateRoute element={<ResumeForm />} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ResumeForm from "./components/ResumeForm";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute"; // Import PrivateRoute
import "./App.css";
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <ToastContainer />
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protecting the routes */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/create-resume"
            element={<PrivateRoute element={<ResumeForm />} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
