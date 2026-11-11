import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait while AuthContext restores the session so valid users aren't kicked to /login on refresh
  if (loading) return <Spinner fullPage />;

  // Redirect unauthenticated visitors to /login; replace avoids a broken back-button history loop
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

