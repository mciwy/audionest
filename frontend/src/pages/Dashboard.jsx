import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    document.body.classList.remove("dashboard-active");
  }, []);

  return (
    <div
      className="dashboard-page animate__animated animate__fadeIn animate__slow"
    >
      <h1>Welcome, {user.email}!</h1>
    </div>
  );
}
