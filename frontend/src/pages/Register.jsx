import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { validateRegister } from '../utils/validators';
import Spinner from '../components/Spinner';
import { CheckSquareIcon } from '../components/Icons';

export default function Register() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // Prevents onAuthStateChange from flashing /dashboard between signUp() and signOut()
  const isRegistering = useRef(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Spinner fullPage />;
  if (user && !isRegistering.current) return <Navigate to="/dashboard" replace />;

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
    const v = validateRegister(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    isRegistering.current = true;
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { name: form.name.trim() } }, // stored in user_metadata
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Assignment requirement: redirect to Login after registering instead of auto-entering Dashboard
      await supabase.auth.signOut();
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch {
      toast.error('Unable to reach server. Please try again.');
    } finally {
      isRegistering.current = false;
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-wrapper">
      <section className="card auth-card" aria-labelledby="register-heading">
        <div className="auth-brand">
          <span className="brand-badge">
            <CheckSquareIcon size={18} />
          </span>
          <span className="brand-name">TaskFlow</span>
        </div>

        <h1 id="register-heading" className="auth-title">
          Create Account
        </h1>
        <p className="auth-subtitle">Sign up to start organizing your daily tasks.</p>

        <form onSubmit={handleSubmit} className="form-stack" noValidate>
          <div className="form-group">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Saving…' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
