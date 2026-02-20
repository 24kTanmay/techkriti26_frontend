import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { registerAsIndividual, createTeam, requestToJoinTeam } from '../../services/eventService';

const RegistrationPanel = ({ competitionName }) => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [regMode, setRegMode] = useState(null); // 'individual' | 'team_leader' | 'team_member'
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');

  const handleRegistration = async () => {
    if (!currentUser) {
      alert("Please sign in to register.");
      return;
    }

    setLoading(true);
    try {
      // PRESERVED LOGIC: eventId generation based on competition name
      const eventId = competitionName.toLowerCase().replace(/\s+/g, '_');

      if (regMode === 'individual') {
        await registerAsIndividual(currentUser.uid, eventId);
        alert(`Successfully registered for ${competitionName}!`);
      } else if (regMode === 'team_leader') {
        if (!teamName) return alert("Please enter a team name");
        const newTeamId = await createTeam(currentUser.uid, eventId, competitionName, teamName);
        alert(`Team "${teamName}" created! Team ID: ${newTeamId}. Share this with your members.`);
      } else if (regMode === 'team_member') {
        if (!teamId) return alert("Please enter Team ID");
        await requestToJoinTeam(currentUser.uid, eventId, teamId);
        alert("Join request sent to team leader!");
      }
      setRegMode(null);
    } catch (error) {
      alert(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
      {!regMode ? (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary sm" 
            onClick={() => {
              if (!currentUser) return alert("Please sign in to register.");
              if (!userData?.profileCompleted) return alert("Please register first to complete your profile.");
              setRegMode('individual');
            }}
          >
            Individual
          </button>
          <button 
            className="btn btn-secondary sm" 
            onClick={() => {
              if (!currentUser) return alert("Please sign in to create a team.");
              if (!userData?.profileCompleted) return alert("Please register first to complete your profile.");
              setRegMode('team_leader');
            }}
          >
            Create Team
          </button>
          <button 
            className="btn btn-secondary sm" 
            onClick={() => {
              if (!currentUser) return alert("Please sign in to join a team.");
              if (!userData?.profileCompleted) return alert("Please register first to complete your profile.");
              setRegMode('team_member');
            }}
          >
            Join Team
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
          <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '14px', textTransform: 'uppercase' }}>
            {regMode === 'individual' && 'Individual Registration'}
            {regMode === 'team_leader' && 'Create a Team'}
            {regMode === 'team_member' && 'Join a Team'}
          </h4>

          {regMode === 'team_leader' && (
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #444', color: 'white' }}
            />
          )}
          {regMode === 'team_member' && (
            <input
              type="text"
              placeholder="Enter Team ID"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #444', color: 'white' }}
            />
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary sm" onClick={handleRegistration} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm'}
            </button>
            <button className="btn btn-text sm" onClick={() => setRegMode(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPanel;
