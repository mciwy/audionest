import { useState } from "react";
import { login, getMe } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";

export default function Login() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      const res = await getMe();
      setUser(res.data);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password!");
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleLogin} className={`auth-form animate__animated ${error ? "animate__shakeX" : "animate__fadeIn animate__slow"}`}>
        <h2>Sign in!</h2>

        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>

        <p className="link">
        If you don't have an account <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
