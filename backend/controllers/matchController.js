const User = require('../models/User');
const bcrypt = require('bcrypt');

const firstNames = ['Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Ava', 'James', 'Isabella', 'Logan', 'Sophia', 'Benjamin', 'Mia', 'Mason', 'Charlotte', 'Elijah', 'Amelia', 'Oliver', 'Harper', 'Jacob', 'Evelyn'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'London, UK', 'Toronto, CA', 'Berlin, DE', 'Sydney, AU', 'Remote', 'Tokyo, JP', 'Singapore'];

const generateFakeUser = async (offers, wants) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const newUser = new User({
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 10000)}@example.com`,
    password: hashedPassword,
    bio: `Hi! I'm ${firstName}. I specialize in ${offers[0]?.skillName || 'many things'} and I'm really eager to learn ${wants[0]?.skillName || 'new skills'}. Let's trade knowledge!`,
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
    
    const offered = currentUser.skillsOffered.map(s => s.skillName.toLowerCase());
    const wanted = currentUser.skillsWanted.map(s => s.skillName.toLowerCase());

    // Ensure every 'wanted' skill has at least one person offering it
    for (let wSkill of currentUser.skillsWanted) {
      const hasProvider = allUsers.some(u => u.skillsOffered.some(so => so.skillName.toLowerCase() === wSkill.skillName.toLowerCase()));
      if (!hasProvider) {
        // Create a fake user that offers this skill, and wants something random or something the user offers
        const fakeOffers = [{ skillName: wSkill.skillName, proficiencyLevel: 'expert' }];
        const randomOfferedSkill = currentUser.skillsOffered.length > 0 
          ? currentUser.skillsOffered[Math.floor(Math.random() * currentUser.skillsOffered.length)].skillName 
          : 'General Programming';
        const fakeWants = [{ skillName: randomOfferedSkill, proficiencyLevel: 'beginner' }];
        
        const newFake = await generateFakeUser(fakeOffers, fakeWants);
        allUsers.push(newFake);
      }
    }

    // Ensure every 'offered' skill has at least one person wanting it
    for (let oSkill of currentUser.skillsOffered) {
      const hasSeeker = allUsers.some(u => u.skillsWanted.some(sw => sw.skillName.toLowerCase() === oSkill.skillName.toLowerCase()));
      if (!hasSeeker) {
        // Create a fake user that wants this skill
        const fakeWants = [{ skillName: oSkill.skillName, proficiencyLevel: 'beginner' }];
        const randomWantedSkill = currentUser.skillsWanted.length > 0 
          ? currentUser.skillsWanted[Math.floor(Math.random() * currentUser.skillsWanted.length)].skillName 
          : 'Basic UI Design';
        const fakeOffers = [{ skillName: randomWantedSkill, proficiencyLevel: 'expert' }];
        
        const newFake = await generateFakeUser(fakeOffers, fakeWants);
        allUsers.push(newFake);
      }
    }

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
