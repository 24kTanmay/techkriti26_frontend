import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAILS } from '../config/admins';
import { getNavigationStructure } from '../utils/navigationHelper';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { currentUser, userData, logout } = useAuth();
  
  // competitionStructure is no longer needed for Navbar, but might be used elsewhere
  // or we can remove it if it was only for the dropdown. 
  // keeping it if we want to pre-load or something, but actually it's unused now.
  // const competitionStructure = getNavigationStructure(); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleNavigate = (path) => {
    navigate(path);
    closeMenu();
  };

  const handleComingSoon = (feature) => {
    alert(`${feature} coming soon!`);
    closeMenu();
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        {/* LOGO */}
        <div
          className="logo"
          onClick={() => handleNavigate('/')}
          style={{ cursor: 'pointer' }}
        >
          TECHKRITI <span className="highlight">26</span>
        </div>

        {/* HAMBURGER ICON */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? 'animate' : ''}`}></div>
          <div className={`bar ${isOpen ? 'animate' : ''}`}></div>
          <div className={`bar ${isOpen ? 'animate' : ''}`}></div>
        </div>

        {/* NAV LINKS */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <div onClick={() => handleNavigate('/')} className="nav-link">
            Home
          </div>

          {/* COMPETITIONS LINK (No Dropdown) */}
          <div onClick={() => handleNavigate('/competitions')} className="nav-link">
            Competitions
          </div>

          <div onClick={() => handleNavigate('/workshops')} className="nav-link">
            Workshops
          </div>
          
          <div onClick={() => handleNavigate('/hackathons')} className="nav-link">
            Hackathons
          </div>


          {/* AUTH BUTTONS */}
          {currentUser ? (
            <>
              {currentUser.email && ADMIN_EMAILS.includes(currentUser.email) && (
                <div onClick={() => handleNavigate('/admin')} className="nav-link">
                  Admin
                </div>
              )}
              {!userData?.profileCompleted ? (
                <div onClick={() => handleNavigate('/profile-setup')} className="nav-link">
                  Register
                </div>
              ) : (
                <div onClick={() => handleNavigate('/dashboard')} className="nav-link">
                  Dashboard
                </div>
              )}
              <button
                className="btn btn-secondary sm"
                onClick={() => { logout(); handleNavigate('/'); }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary sm"
              onClick={() => handleNavigate('/signin')}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;