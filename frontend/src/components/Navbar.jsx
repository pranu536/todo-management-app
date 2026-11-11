import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { CheckSquareIcon, LogOutIcon, MenuIcon } from './Icons';

export default function Navbar({ onMenuClick }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Could not log out');
        return;
      }
      toast.success('Logged out');
      navigate('/login');
    } catch {
      toast.error('Network error while logging out');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          {onMenuClick && (
            <button
              type="button"
              className="icon-btn menu-toggle"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
            >
              <MenuIcon size={20} />
            </button>
          )}
          <div className="navbar-brand-group">
            <span className="brand-badge brand-badge--sm mobile-only-badge">
              <CheckSquareIcon size={15} />
            </span>
            <span className="navbar-brand">To-Do Management App</span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleLogout}
          disabled={signingOut}
        >
          <LogOutIcon size={16} />
          <span>{signingOut ? 'Saving…' : 'Logout'}</span>
        </button>
      </div>
    </header>
  );
}
