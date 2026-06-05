const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  category: { type: String },
  proficiencyLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'expert'], 
    default: 'beginner' 
  }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  photo: { type: String, default: '' },
  skillsOffered: [skillSchema],
  skillsWanted: [skillSchema],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
