
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import './ProfileSetup.css'

export default function ProfileSetupPage() {
    const router = useRouter()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [formData, setFormData] = useState({
        fullName: 'John Doe', // Mock data from registration
        email: 'john.doe@example.com', // Mock data from registration
        phoneNumber: '',
        college: '',
        year: '',
        gender: '',
        city: '',
        state: '',
        referralCode: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [showSuccess, setShowSuccess] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setShowSuccess(false), 5000)
        return () => clearTimeout(timer)
    }, [])

    // Star animation engine
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let w: number, h: number, stars: any[] = []
        let animationFrameId: number

        const init = () => {
            w = canvas.width = window.innerWidth
            h = canvas.height = window.innerHeight
            stars = []
            for (let i = 0; i < 200; i++) {
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 2,
                    alpha: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.05
                })
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h)
            stars.forEach(s => {
                s.alpha += s.speed
                if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed
                
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`
                ctx.fill()
            })
            animationFrameId = requestAnimationFrame(draw)
        }

        window.addEventListener('resize', init)
        init()
        draw()

        return () => {
            window.removeEventListener('resize', init)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Mock submission
        setTimeout(() => {
            console.log('Profile Data Submitted:', formData)
            // Redirect to dashboard or success page
            router.push('/dashboard')
        }, 2000)
    }

    return (
        <div className="profile-setup-container">
            <div className="profile-setup-background">
                <canvas id="star-canvas-profile" ref={canvasRef}></canvas>
                <div className="noise-profile"></div>
                
                {/* Ambient Copper Light */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(203, 163, 129, 0.05) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    pointerEvents: 'none',
                    zIndex: 2
                }}></div>
            </div>

            {/* Success Notification */}
            {showSuccess && (
                <div 
                    style={{
                        position: 'fixed',
                        top: '2rem',
                        right: '2rem',
                        background: 'rgba(74, 222, 128, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(74, 222, 128, 0.2)',
                        padding: '1rem 1.5rem',
                        borderRadius: '16px',
                        color: '#4ade80',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        animation: 'fadeIn 0.5s ease-out'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Account created! Now, let&apos;s set up your profile.
                </div>
            )}

            <div className="profile-setup-card">
                <div className="profile-setup-header">
                    <span className="status-tag">Step 2 of 2</span>
                    <h1 className="profile-title">
                        Complete Your <i>Profile</i>
                    </h1>
                    <p className="profile-desc">
                        Tell us more about yourself to customize your festival experience.
                    </p>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Full Name</label>
                        <input 
                            type="text" 
                            id="fullName"
                            name="fullName"
                            className="form-input read-only"
                            value={formData.fullName}
                            readOnly
                        />
                        <div className="input-accent"></div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            className="form-input read-only"
                            value={formData.email}
                            readOnly
                        />
                        <div className="input-accent"></div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                        <input 
                            type="tel" 
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="+91 00000 00000"
                            className="form-input"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        <div className="input-accent"></div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="gender">Gender</label>
                        <select 
                            id="gender"
                            name="gender"
                            className="form-input form-select"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                        <div className="input-accent"></div>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label" htmlFor="college">College / University</label>
                        <input 
                            type="text" 
                            id="college"
                            name="college"
                            placeholder="e.g. IIT Kanpur"
                            className="form-input"
                            value={formData.college}
                            onChange={handleChange}
                            required
                        />
                        <div className="input-accent"></div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="year">Year of Study</label>
                        <select 
                            id="year"
                            name="year"
                            className="form-input form-select"
                            value={formData.year}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                            <option value="5">5th Year+</option>
                            <option value="graduate">Graduate</option>
                        </select>
                        <div className="input-accent"></div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="city">City</label>
                        <input 
                            type="text" 
                            id="city"
                            name="city"
                            placeholder="e.g. Kanpur"
                            className="form-input"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        <div className="input-accent"></div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="state">State</label>
                        <select 
                            id="state"
                            name="state"
                            className="form-input form-select"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select State</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="input-accent"></div>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label" htmlFor="referralCode">Referral Code (Optional)</label>
                        <input 
                            type="text" 
                            id="referralCode"
                            name="referralCode"
                            placeholder="e.g. TK-SC-123"
                            className="form-input"
                            value={formData.referralCode}
                            onChange={handleChange}
                        />
                        <div className="input-accent"></div>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Syncing...' : (
                            <>
                                Complete Registration
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
