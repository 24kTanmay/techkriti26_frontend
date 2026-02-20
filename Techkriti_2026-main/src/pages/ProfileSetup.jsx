import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ProfileSetup = () => {
    const { currentUser, setUserData } = useAuth();
    const [formData, setFormData] = useState({
        fullName: currentUser?.displayName || '',
        email: currentUser?.email || '',
        college: '',
        phone: '',
        city: '',
        branch: '',
        year: '',
        gender: '',
        referralCode: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!formData.college.trim()) newErrors.college = "College/University is required";
        
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone Number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits";
        }

        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.branch.trim()) newErrors.branch = "Branch is required";
        if (!formData.year) newErrors.year = "Year of Study is required";
        if (!formData.gender) newErrors.gender = "Gender is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        if (field === 'phone') {
            if (!/^\d*$/.test(value)) return;
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const userData = {
                ...formData,
                uid: currentUser.uid,
                profileCompleted: true,
                createdAt: new Date().toISOString()
            };
            
            // Direct write to Firestore
            await setDoc(doc(db, "users", currentUser.uid), userData);
            
            setUserData(userData);
            navigate('/');
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-setup-container" style={{ paddingTop: '80px' }}>
            <div className="profile-card">
                <h1 className="profile-title">
                    Complete Your <span className="text-primary">Profile</span>
                </h1>
                
                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input disabled"
                            type="email"
                            value={formData.email}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            className={`form-input ${errors.phone ? 'input-error' : ''}`}
                            type="tel"
                            placeholder="Enter 10-digit number"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            maxLength="10"
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">College / University</label>
                        <input
                            className={`form-input ${errors.college ? 'input-error' : ''}`}
                            type="text"
                            placeholder="e.g. IIT Kanpur"
                            value={formData.college}
                            onChange={(e) => handleChange('college', e.target.value)}
                        />
                        {errors.college && <span className="error-text">{errors.college}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Branch/Stream</label>
                        <input
                            className={`form-input ${errors.branch ? 'input-error' : ''}`}
                            type="text"
                            placeholder="e.g. Computer Science"
                            value={formData.branch}
                            onChange={(e) => handleChange('branch', e.target.value)}
                        />
                        {errors.branch && <span className="error-text">{errors.branch}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Year of Study</label>
                        <select
                            className={`form-input ${errors.year ? 'input-error' : ''}`}
                            value={formData.year}
                            onChange={(e) => handleChange('year', e.target.value)}
                        >
                            <option value="" disabled>Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Post Graduate">Post Graduate</option>
                            <option value="PHD">PHD</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.year && <span className="error-text">{errors.year}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">City</label>
                        <input
                            className={`form-input ${errors.city ? 'input-error' : ''}`}
                            type="text"
                            placeholder="Enter your city"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                        />
                        {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select
                            className={`form-input ${errors.gender ? 'input-error' : ''}`}
                            value={formData.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <span className="error-text">{errors.gender}</span>}
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Referral Code (Optional)</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Enter code if any"
                            value={formData.referralCode}
                            onChange={(e) => handleChange('referralCode', e.target.value)}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary full-width" 
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : 'Complete Setup'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
