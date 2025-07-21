import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Canvas from "./pages/Canvas";
import OtpVerify from "./pages/OtpVerify";
import Todo from "./pages/Todo";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/signup" replace />} /> */}
      <Route path="/verify-email" element={<OtpVerify />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/canvas"
        element={
          <PrivateRoute>
            <Canvas />
          </PrivateRoute>
        }
      />
      <Route
        path="/manageTask/:id"
        element={
          <PrivateRoute>
            <Todo />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
