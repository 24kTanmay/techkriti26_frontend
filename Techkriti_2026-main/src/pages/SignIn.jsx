import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      
      // Check if user has completed profile
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && userDoc.data().profileCompleted) {
        // Redirect to where they were going, or home
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        // Redirect to profile setup
        navigate('/profile-setup');
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="signin-page" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--white)', marginBottom: '30px' }}>Join TechKriti'26</h1>
      <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>Sign in with your Google account to register for events.</p>

      <button className="btn btn-primary" onClick={handleLogin}>
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ marginRight: '10px', width: '18px' }} />
        Continue with Google
      </button>
    </div>
  );
};

export default SignIn;

