"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../../firebase';
import Navbar from '../../components/common/Navbar';

const SignInContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (): Promise<void> => {
        setLoading(true);
        try {
            const user = await loginWithGoogle();
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data() as DocumentData;
                if (userData.profileCompleted) {
                    const from = searchParams.get('from') || '/';
                    router.push(from);
                } else {
                    router.push('/profile-setup');
                }
            } else {
                router.push('/profile-setup');
            }
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-container">
            <Navbar />
            {/* Inline Styles from the HTML */}
            <style>{`
                :root {
                    --primary-blue: #2563eb;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.12);
                    --text-main: #ffffff;
                    --text-dim: rgba(255, 255, 255, 0.6);
                }

                .signin-container {
                    background-color: #050505;
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                }

                /* Animated Starfield Background */
                .background-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    background: radial-gradient(circle at 50% 50%, #1a1a2e 0%, #050505 100%);
                    pointer-events: none;
                }

                .stars {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('https://www.transparenttextures.com/patterns/stardust.png');
                    opacity: 0.5;
                    animation: moveStars 100s linear infinite;
                }

                @keyframes moveStars {
                    from { background-position: 0 0; }
                    to { background-position: 1000px 1000px; }
                }

                /* Ambient Glows */
                .glow {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%); /* More neutral/white glow */
                    border-radius: 50%;
                    filter: blur(80px); /* Soften the blur */
                    z-index: -1;
                }

                /* Glassmorphic Card */
                .card {
                    background: rgba(255, 255, 255, 0.02); /* Very faint tint */
                    backdrop-filter: blur(2px); /* Minimal blur to keep background visible */
                    -webkit-backdrop-filter: blur(2px);
                    border: 1px solid rgba(255, 255, 255, 0.15); /* Stronger border to define shape */
                    border-radius: 32px;
                    padding: 3rem 2rem;
                    width: 90%;
                    max-width: 440px;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    transition: transform 0.3s ease;
                    z-index: 10;
                    position: relative;
                }

                .card:hover {
                    border-color: rgba(255, 255, 255, 0.2);
                }

                /* Typography */
                .phase-tag {
                    font-size: 0.7rem;
                    letter-spacing: 0.2rem;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                    display: block;
                }

                .card h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    background: linear-gradient(180deg, #FFFFFF 0%, #999999 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }

                .card p {
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 300;
                    line-height: 1.6;
                    margin-bottom: 2.5rem;
                    font-size: 1rem;
                }

                /* Premium Button */
                .google-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    width: 100%;
                    padding: 14px;
                    background: #ffffff;
                    color: #000000;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none;
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
                }

                .google-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
                    background: #f8f8f8;
                }

                .google-btn:active {
                    transform: translateY(0);
                }
                
                .google-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .google-icon {
                    width: 20px;
                    height: 20px;
                }

                /* Branding Footer */
                .footer-logo {
                    margin-top: 2rem;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.6);
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .footer-logo span {
                    font-weight: 700;
                    color: white;
                    letter-spacing: 1px;
                }
            `}</style>
            
            <div className="background-container">
                <div className="stars"></div>
                <div className="glow" style={{ top: '10%', right: '10%' }}></div>
                <div className="glow" style={{ bottom: '10%', left: '10%' }}></div>
            </div>

            <div className="card">
                <span className="phase-tag">/ Welcome_Portal</span>
                <h1>Join TechKriti&apos;26</h1>
                <p>Sign in with your Google account to register for events and explore Asia&apos;s largest technical stage.</p>
                
                <button className="google-btn" onClick={handleLogin} disabled={loading}>
                    {loading ? (
                        <span className="flex items-center gap-2">Processing...</span>
                    ) : (
                        <>
                            <svg className="google-icon" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                <path fill="none" d="M0 0h48v48H0z"/>
                            </svg>
                            Continue with Google
                        </>
                    )}
                </button>

                <div className="footer-logo">
                    <span>TECHKRITI</span>
                    IIT KANPUR
                </div>
            </div>
        </div>
    );
};

export default function SignIn() {
    return (
        <Suspense fallback={<div style={{ backgroundColor: '#050505', height: '100vh', width: '100vw' }}></div>}>
            <SignInContent />
        </Suspense>
    );
}
