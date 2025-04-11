import { useState } from 'react';
import { register, login, getMe } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';

export default function Register() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" />;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      await login(email, password);
      const res = await getMe();
      setUser(res.data);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Try another email.');
    }
  };

  return (
    <div className="auth-page">
      <form
        onSubmit={handleRegister}
        className={`auth-form animate__animated ${error ? 'animate__shakeX' : 'animate__fadeIn animate__slow'}`}
      >
        <h2>Register!</h2>

        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>

        <p className="link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}
