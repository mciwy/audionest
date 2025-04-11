import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SplashScreen from "./components/SplashScreen";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  return children;
}

function App() {
  const { loading, user } = useAuth();
  const [splashVisible, setSplashVisible] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setFadeSplash(true), 300);
      setTimeout(() => setSplashVisible(false), 1800);
    }
  }, [loading]);

  if (loading) return null;

  return (
    <>
      {user && <Dashboard />}

      {splashVisible && <SplashScreen fadeOut={fadeSplash} />}

      {!user && !splashVisible && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
