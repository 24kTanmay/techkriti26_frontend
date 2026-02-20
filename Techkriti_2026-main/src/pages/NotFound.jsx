import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'hsl(var(--color-bg-dark))',
      color: 'hsl(var(--color-text-main))',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '6rem', 
        marginBottom: '1rem', 
        margin: 0,
        background: 'linear-gradient(to right, hsl(var(--color-primary)), hsl(var(--color-secondary)))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: '800'
      }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.1rem', color: 'hsl(var(--color-text-muted))', marginBottom: '2.5rem', maxWidth: '500px' }}>
        Oops! The page you are looking for might not exist or has been moved.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="btn btn-primary"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
