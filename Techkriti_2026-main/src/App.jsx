import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Entrepreneurial from './pages/Entrepreneurial';
import Events from './pages/Technical';
import Miscellaneous from './pages/Miscellaneous';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import EventDetails from './pages/EventDetails';
import CategoryEvents from './pages/CategoryEvents';
import CompetitionDetails from './pages/CompetitionDetails';
import ComingSoon from './pages/ComingSoon';
import ProfileSetup from './pages/ProfileSetup';
import Competitions from './pages/Competitions';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import AdminRoute from './components/AdminRoute';

/* ---------- Private Route / Profile Check ---------- */
const ProtectedLayout = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  if (!userData?.profileCompleted && location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" />;
  }

  return children;
};

/* ---------- Layout ---------- */
const Layout = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Scroll to top on route change (Handled by component or effect here)
  /* Better to put <ScrollToTop /> inside Router in App, but Layout is inside Router so it works */
  
  // Show global navbar on major pages

  const showNavbar =
    location.pathname === '/' ||
    location.pathname === '/dashboard' ||
    location.pathname.startsWith('/events') ||
    location.pathname.startsWith('/competitions') ||
    location.pathname === '/hackathons' ||
    location.pathname === '/workshops' ||
    location.pathname === '/signin' ||
    location.pathname === '/profile-setup' ||
    location.pathname === '/admin';

  return (
    <>
      <ScrollToTop />
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signin" element={<SignIn />} />
        
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        <Route path="/profile-setup" element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        } />

        <Route path="/register" element={
          <ProtectedLayout>
            <Register />
          </ProtectedLayout>
        } />

        {/* New Competition Routes */}
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/competitions/:category/:categoryId" element={<CategoryEvents />} />
        <Route path="/competitions/:category/:categoryId/:competitionId" element={<CompetitionDetails />} />

        <Route path="/events/technical" element={<Events />} />
        <Route
          path="/events/entrepreneurial"
          element={<Entrepreneurial />}
        />
        <Route path="/events/miscellaneous" element={<Miscellaneous />} />
        <Route path="/events/event-details/:id" element={<EventDetails />} />
        
        {/* Coming Soon Routes */}
        <Route path="/hackathons" element={<ComingSoon title="HACKATHONS" />} />
        <Route path="/workshops" element={<ComingSoon title="WORKSHOPS" />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
};

/* ---------- App Root ---------- */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Layout />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Simple ProtectedRoute for ProfileSetup (where userData might be null)
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/signin" />;
  return children;
};

export default App;


