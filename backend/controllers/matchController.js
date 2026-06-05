const User = require('../models/User');

const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const allUsers = await User.find({ _id: { $ne: currentUser._id }, isActive: true }).select('-password');
    
    const offered = currentUser.skillsOffered.map(s => s.skillName.toLowerCase());
    const wanted = currentUser.skillsWanted.map(s => s.skillName.toLowerCase());

    const matches = allUsers.map(otherUser => {
      const theirOffered = otherUser.skillsOffered.map(s => s.skillName.toLowerCase());
      const theirWanted = otherUser.skillsWanted.map(s => s.skillName.toLowerCase());

      const iCanTeachThem = offered.filter(s => theirWanted.includes(s)).length;
      const theyCanTeachMe = theirOffered.filter(s => wanted.includes(s)).length;
      
      const matchScore = iCanTeachThem + theyCanTeachMe;

      return {
        user: otherUser,
        matchScore,
        iCanTeachThem,
        theyCanTeachMe
      };
    }).filter(match => match.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMatches };
