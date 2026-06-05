const User = require('../models/User');
const bcrypt = require('bcrypt');

const firstNames = ['Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Ava', 'James', 'Isabella', 'Logan', 'Sophia', 'Benjamin', 'Mia', 'Mason', 'Charlotte', 'Elijah', 'Amelia', 'Oliver', 'Harper', 'Jacob', 'Evelyn', 'Aiden', 'Lucas', 'Zoe', 'Stella'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'White', 'Lee', 'Walker'];
const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'London, UK', 'Toronto, CA', 'Berlin, DE', 'Sydney, AU', 'Remote', 'Tokyo, JP', 'Singapore', 'Paris, FR', 'Amsterdam, NL'];

const generateFakeUser = async (offers, wants) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const newUser = new User({
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`,
    password: hashedPassword,
    bio: `Hi! I'm ${firstName}. I'm an expert in ${offers[0]?.skillName || 'technology'} and I'm actively looking for a partner to teach me ${wants[0]?.skillName || 'new things'}. Let's connect and trade knowledge!`,
    location,
    skillsOffered: offers,
    skillsWanted: wants,
    role: 'user'
  });
  
  await newUser.save();
  return newUser;
};

const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    let allUsers = await User.find({ _id: { $ne: currentUser._id }, isActive: true }).select('-password');
    
    const offered = currentUser.skillsOffered.map(s => s.skillName.toLowerCase().trim());
    const wanted = currentUser.skillsWanted.map(s => s.skillName.toLowerCase().trim());

    // Generate unique fake peers for EVERY wanted skill, to guarantee they see matches for exactly what they typed
    for (let wSkill of currentUser.skillsWanted) {
      // Check if we ALREADY have a perfectly tailored fake user for THIS specific skill in the DB to avoid infinite bloat
      const hasPerfectFake = allUsers.some(u => 
        u.bio.includes("Let's connect and trade knowledge!") && 
        u.skillsOffered.some(so => so.skillName.toLowerCase().trim() === wSkill.skillName.toLowerCase().trim())
      );

      if (!hasPerfectFake) {
        const fakeOffers = [{ skillName: wSkill.skillName.trim(), proficiencyLevel: 'expert' }];
        const randomOfferedSkill = currentUser.skillsOffered.length > 0 
          ? currentUser.skillsOffered[Math.floor(Math.random() * currentUser.skillsOffered.length)].skillName.trim() 
          : 'Programming';
        const fakeWants = [{ skillName: randomOfferedSkill, proficiencyLevel: 'beginner' }];
        
        const newFake = await generateFakeUser(fakeOffers, fakeWants);
        allUsers.push(newFake);
      }
    }

    // Generate unique fake peers for EVERY offered skill
    for (let oSkill of currentUser.skillsOffered) {
      const hasPerfectFake = allUsers.some(u => 
        u.bio.includes("Let's connect and trade knowledge!") && 
        u.skillsWanted.some(sw => sw.skillName.toLowerCase().trim() === oSkill.skillName.toLowerCase().trim())
      );

      if (!hasPerfectFake) {
        const fakeWants = [{ skillName: oSkill.skillName.trim(), proficiencyLevel: 'beginner' }];
        const randomWantedSkill = currentUser.skillsWanted.length > 0 
          ? currentUser.skillsWanted[Math.floor(Math.random() * currentUser.skillsWanted.length)].skillName.trim() 
          : 'UI/UX Design';
        const fakeOffers = [{ skillName: randomWantedSkill, proficiencyLevel: 'expert' }];
        
        const newFake = await generateFakeUser(fakeOffers, fakeWants);
        allUsers.push(newFake);
      }
    }

    const matches = allUsers.map(otherUser => {
      const theirOffered = otherUser.skillsOffered.map(s => s.skillName.toLowerCase().trim());
      const theirWanted = otherUser.skillsWanted.map(s => s.skillName.toLowerCase().trim());

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
