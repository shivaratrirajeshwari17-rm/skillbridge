import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import Topbar from '../components/Topbar';
import SkillTag from '../components/SkillTag';
import Loader from '../components/Loader';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U';
const getAvatarClass = (name) => {
  const classes = ['avatar-grad-1','avatar-grad-2','avatar-grad-3','avatar-grad-4','avatar-grad-5'];
  return classes[(name || 'U').charCodeAt(0) % classes.length];
};

const Matches = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axiosInstance.get('/match');
        setMatches(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMatches();
  }, [user]);

  const handleSendRequest = async (receiverId, skillOffered, skillWanted) => {
    try {
      await axiosInstance.post('/trade', {
        receiverId,
        message: `Hi, I saw we have a skill match! I can offer ${skillOffered} in exchange for ${skillWanted}. Would you be interested?`,
        skillOffered,
        skillWanted
      });
      alert('Trade request sent successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="page-fade">
      <Topbar title="Skill Matches" />
      <div className="page-content">
        <div className="section-header">
          <div>
            <div className="section-title">Your Matches</div>
            <div className="section-subtitle">Based on your skills offered and wanted</div>
          </div>
        </div>

        {loading ? <Loader /> : error ? (
          <div className="empty-state">
            <div className="empty-title" style={{ color: 'var(--danger)' }}>Error</div>
            <div className="empty-desc">{error}</div>
          </div>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No Matches Yet</div>
            <div className="empty-desc">Try adding more skills to your profile to find potential learning partners.</div>
          </div>
        ) : (
          <div className="grid-3">
            {matches.map(({ user: matchUser, matchScore, iCanTeachThem, theyCanTeachMe }) => {
              const offeredMatch = user.skillsWanted.find(sw => matchUser.skillsOffered.some(so => so.skillName.toLowerCase() === sw.skillName.toLowerCase()))?.skillName || matchUser.skillsOffered[0]?.skillName;
              const wantedMatch = user.skillsOffered.find(so => matchUser.skillsWanted.some(sw => sw.skillName.toLowerCase() === so.skillName.toLowerCase()))?.skillName || matchUser.skillsWanted[0]?.skillName;

              return (
                <div key={matchUser._id} className="match-card flex-col">
                  <div className="flex justify-between items-start mb-16">
                    <div className={`avatar-lg ${getAvatarClass(matchUser.name)}`} style={{ color: 'white' }}>
                      {matchUser.photo ? <img src={matchUser.photo} alt={matchUser.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} /> : getInitials(matchUser.name)}
                    </div>
                    <div className={`match-percent ${matchScore >= 2 ? 'high' : matchScore === 1 ? 'mid' : 'low'}`} title="Match Score">
                      {Math.min(matchScore * 50, 100)}%
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{matchUser.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>{matchUser.location || 'Global'}</div>
                  
                  <div className="mb-12">
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent3)', textTransform: 'uppercase', marginBottom: 6 }}>They Teach</div>
                    <div className="skills-wrap">
                      {matchUser.skillsOffered.slice(0, 3).map((s, i) => <SkillTag key={i} skill={s} type="offered" />)}
                      {matchUser.skillsOffered.length > 3 && <span style={{ fontSize: 11, color: 'var(--muted)' }}>+{matchUser.skillsOffered.length - 3}</span>}
                    </div>
                  </div>
                  
                  <div className="mb-20 mt-auto">
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent2)', textTransform: 'uppercase', marginBottom: 6 }}>They Want</div>
                    <div className="skills-wrap">
                      {matchUser.skillsWanted.slice(0, 3).map((s, i) => <SkillTag key={i} skill={s} type="wanted" />)}
                      {matchUser.skillsWanted.length > 3 && <span style={{ fontSize: 11, color: 'var(--muted)' }}>+{matchUser.skillsWanted.length - 3}</span>}
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary btn-full" 
                    onClick={() => handleSendRequest(matchUser._id, wantedMatch || 'my skill', offeredMatch || 'your skill')}
                  >
                    Send Request
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
