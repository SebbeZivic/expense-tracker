import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login.jsx";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Laddar...
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route
            path="/register"
            element={<div>Register kommer snart...</div>}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard kommer snart...</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
