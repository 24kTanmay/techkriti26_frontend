import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getUserRegistrations,
    getPendingRequestsForLeader,
    getSentRequests,
    handleTeamRequest,
    withdrawFromEvent
} from '../services/eventService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser, userData, logout } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, [currentUser]);

    const fetchDashboardData = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const [regs, leaderRequests, myRequests] = await Promise.all([
                getUserRegistrations(currentUser.uid),
                getPendingRequestsForLeader(currentUser.uid),
                getSentRequests(currentUser.uid)
            ]);

            setRegistrations(regs);
            setPendingRequests(leaderRequests);
            setSentRequests(myRequests);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const onAcceptRequest = async (requestId) => {
        try {
            await handleTeamRequest(requestId, 'accepted');
            fetchDashboardData();
        } catch (error) {
            console.error("Accept Error:", error);
            alert("Failed to accept request: " + error.message);
        }
    };

    const onRejectRequest = async (requestId) => {
        try {
            await handleTeamRequest(requestId, 'rejected');
            fetchDashboardData();
        } catch (error) {
            alert("Failed to reject request");
        }
    };

    const onWithdraw = async (eventId) => {
        if (window.confirm("Are you sure you want to withdraw from this event?")) {
            try {
                await withdrawFromEvent(currentUser.uid, eventId);
                fetchDashboardData();
            } catch (error) {
                alert("Failed to withdraw");
            }
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>Loading Dashboard...</div>;

    return (
        <div className="dashboard-page" style={{ padding: '100px 20px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', margin: 0 }}>Dashboard</h1>
            <button className="btn btn-secondary sm" onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </div>

            {/* Personal Details Section */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>Personal Details</h2>
                <div className="glass-card" style={{ padding: '25px', borderRadius: '15px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>Full Name</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word' }}>{userData?.fullName || currentUser?.displayName}</p>
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>Email Address</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word' }}>{userData?.email || currentUser?.email}</p>
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>College</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word' }}>{userData?.college || 'N/A'}</p>
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>Phone</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word' }}>{userData?.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>City</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word' }}>{userData?.city || 'N/A'}</p>
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>Branch</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word' }}>{userData?.branch || 'N/A'}</p>
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>Year</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word' }}>{userData?.year || 'N/A'}</p>
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>Gender</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word' }}>{userData?.gender || 'N/A'}</p>
                        </div>
                        <div>
                            <p style={{ color: '#888', marginBottom: '5px', fontSize: '14px' }}>Referral Code</p>
                            <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: '600', wordBreak: 'break-word', color: 'var(--color-primary)' }}>{userData?.referralCode || '-'}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>My Registrations</h2>
                {registrations.length === 0 ? (
                    <p style={{ color: '#888' }}>You haven't registered for any events yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {registrations.map(reg => (
                            <div key={reg.id} className="glass-card" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{reg.event?.name || reg.eventName || reg.eventId}</h3>
                                        {reg.teamId && (
                                            <div style={{ margin: '10px 0' }}>
                                                <p style={{ margin: '0 0 5px 0', color: 'var(--primary)', fontWeight: '600' }}>
                                                    Team: {reg.team?.name} ({reg.role})
                                                </p>
                                                {reg.role === 'leader' && (
                                                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#aaa' }}>
                                                        Team ID: <span style={{ color: 'var(--white)', fontWeight: 'bold' }}>{reg.teamId}</span> (Share this with members)
                                                    </p>
                                                )}

                                                {/* Team Members List */}
                                                {reg.team?.memberDetails && (
                                                    <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                                                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Team Members</p>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                            {reg.team.memberDetails.map(member => (
                                                                <span key={member.uid} style={{
                                                                    fontSize: 'clamp(11px, 2.5vw, 13px)',
                                                                    background: 'rgba(255,255,255,0.05)',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '20px',
                                                                    border: member.uid === currentUser.uid ? '1px solid var(--primary)' : '1px solid transparent'
                                                                }}>
                                                                    {member.fullName} {member.uid === currentUser.uid && '(You)'}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button className="btn btn-secondary sm" onClick={() => onWithdraw(reg.eventId)} style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', border: '1px solid #ff4444', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {sentRequests.length > 0 && (
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>Sent Team Requests</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {sentRequests.map(req => (
                            <div key={req.id} className="glass-card" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0' }}>Request to join Team: <span style={{ color: 'var(--primary)' }}>{req.teamId}</span></h4>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>Event: {req.eventName || req.eventId}</p>
                                    </div>
                                    <span style={{
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: 'clamp(10px, 2vw, 12px)',
                                        whiteSpace: 'nowrap',
                                        background: 'rgba(255,165,0,0.1)',
                                        color: '#ffa500',
                                        border: '1px solid #ffa500'
                                    }}>
                                        Pending
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {pendingRequests.length > 0 && (
                <section style={{ marginBottom: '50px' }}>
                    <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', color: 'var(--primary)' }}>Join Requests for Your Teams</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {pendingRequests.map(req => (
                            <div key={req.id} className="glass-card" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{req.user?.fullName || 'Unknown User'}</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px', color: '#ccc' }}>
                                            <p style={{ margin: 0 }}><strong>College:</strong> {req.user?.college || 'N/A'}</p>
                                            <p style={{ margin: 0 }}><strong>Phone:</strong> {req.user?.phone || 'N/A'}</p>
                                            <p style={{ margin: 0 }}><strong>Event:</strong> {req.eventName || req.eventId}</p>
                                            <p style={{ margin: 0 }}><strong>Team ID:</strong> {req.teamId}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-primary sm" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }} onClick={() => onAcceptRequest(req.id)}>Accept</button>
                                        <button className="btn btn-secondary sm" style={{ border: '1px solid #444', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }} onClick={() => onRejectRequest(req.id)}>Reject</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button className="btn btn-primary" onClick={() => navigate('/events/technical')}>Explore More Events</button>
            </div>
        </div>
    );

};

export default Dashboard;

