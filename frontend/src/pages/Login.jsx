import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validators';
import Spinner from '../components/Spinner';
import { CheckSquareIcon } from '../components/Icons';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Spinner fullPage />;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateLogin(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        toast.error('Invalid email or password');
        return;
      }

      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Unable to reach server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-wrapper">
      <section className="card auth-card" aria-labelledby="login-heading">
        <div className="auth-brand">
          <span className="brand-badge">
            <CheckSquareIcon size={18} />
          </span>
          <span className="brand-name">TaskFlow</span>
        </div>

        <h1 id="login-heading" className="auth-title">
          Welcome Back
        </h1>
        <p className="auth-subtitle">Log in to manage your tasks and stay on track.</p>

        <form onSubmit={handleSubmit} className="form-stack" noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Saving…' : 'Log In'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}
