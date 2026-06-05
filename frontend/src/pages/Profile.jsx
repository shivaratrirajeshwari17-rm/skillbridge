import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import Topbar from '../components/Topbar';
import SkillTag from '../components/SkillTag';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', bio: '', location: '', photo: '',
    skillsOffered: [], skillsWanted: []
  });
  const [newSkillOffered, setNewSkillOffered] = useState({ name: '', level: 'beginner' });
  const [newSkillWanted, setNewSkillWanted] = useState({ name: '', level: 'beginner' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        photo: user.photo || '',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || []
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await axiosInstance.put('/users/me', formData);
      setUser({ ...user, ...res.data });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const addSkill = (type) => {
    if (type === 'offered' && newSkillOffered.name) {
      setFormData({ ...formData, skillsOffered: [...formData.skillsOffered, { skillName: newSkillOffered.name, proficiencyLevel: newSkillOffered.level }] });
      setNewSkillOffered({ name: '', level: 'beginner' });
    } else if (type === 'wanted' && newSkillWanted.name) {
      setFormData({ ...formData, skillsWanted: [...formData.skillsWanted, { skillName: newSkillWanted.name, proficiencyLevel: newSkillWanted.level }] });
      setNewSkillWanted({ name: '', level: 'beginner' });
    }
  };

  const removeSkill = (type, skillName) => {
    if (type === 'offered') {
      setFormData({ ...formData, skillsOffered: formData.skillsOffered.filter(s => s.skillName !== skillName) });
    } else {
      setFormData({ ...formData, skillsWanted: formData.skillsWanted.filter(s => s.skillName !== skillName) });
    }
  };

  if (!user) return null;

  return (
    <div className="page-fade">
      <Topbar title="My Profile" />
      <div className="page-content" style={{ maxWidth: 800 }}>
        
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <div className="profile-cover" />
          <div style={{ position: 'relative', padding: '0 32px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -40, marginBottom: 24 }}>
              <div className="profile-avatar" style={{ border: '4px solid var(--card)' }}>
                {user.photo ? <img src={user.photo} style={{width:'100%',borderRadius:'50%'}}/> : user.name[0].toUpperCase()}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Location</label>
                  <input className="input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. San Francisco, CA" />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Bio</label>
                  <textarea className="input" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell people about yourself..." />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Profile Photo URL</label>
                  <input className="input" value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} placeholder="https://..." />
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700 }}>{user.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>{user.location || 'Location not specified'}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{user.bio || 'No bio provided yet. Add a bio to tell potential skill partners about yourself!'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid-2">
          {/* SKILLS OFFERED */}
          <div className="card">
            <div className="section-title mb-16">Skills I Can Teach</div>
            <div className="skills-wrap mb-20">
              {(isEditing ? formData.skillsOffered : user.skillsOffered).map((s, i) => (
                <SkillTag key={i} skill={s} type="offered" onRemove={isEditing ? () => removeSkill('offered', s.skillName) : null} />
              ))}
            </div>
            
            {isEditing && (
              <div className="flex gap-8 items-center" style={{ background: 'var(--bg3)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                <input className="input" placeholder="Add skill..." value={newSkillOffered.name} onChange={e => setNewSkillOffered({...newSkillOffered, name: e.target.value})} style={{ flex: 1 }} />
                <select className="input" value={newSkillOffered.level} onChange={e => setNewSkillOffered({...newSkillOffered, level: e.target.value})} style={{ width: 'auto' }}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermed.</option>
                  <option value="expert">Expert</option>
                </select>
                <button className="btn btn-primary" onClick={() => addSkill('offered')}>+</button>
              </div>
            )}
          </div>

          {/* SKILLS WANTED */}
          <div className="card">
            <div className="section-title mb-16">Skills I Want to Learn</div>
            <div className="skills-wrap mb-20">
              {(isEditing ? formData.skillsWanted : user.skillsWanted).map((s, i) => (
                <SkillTag key={i} skill={s} type="wanted" onRemove={isEditing ? () => removeSkill('wanted', s.skillName) : null} />
              ))}
            </div>
            
            {isEditing && (
              <div className="flex gap-8 items-center" style={{ background: 'var(--bg3)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                <input className="input" placeholder="Add skill..." value={newSkillWanted.name} onChange={e => setNewSkillWanted({...newSkillWanted, name: e.target.value})} style={{ flex: 1 }} />
                <select className="input" value={newSkillWanted.level} onChange={e => setNewSkillWanted({...newSkillWanted, level: e.target.value})} style={{ width: 'auto' }}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermed.</option>
                  <option value="expert">Expert</option>
                </select>
                <button className="btn btn-primary" onClick={() => addSkill('wanted')}>+</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
