const mongoose = require('mongoose');
const dotenv = require('dotenv');
const matchController = require('./controllers/matchController');
const User = require('./models/User');

dotenv.config();

const testMatch = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Create a test user
  const testUser = new User({
    name: 'Test Matcher',
    email: 'testmatcher@example.com',
    password: 'abc',
    skillsWanted: [{ skillName: 'Quantum Computing' }],
    skillsOffered: [{ skillName: 'Underwater Basket Weaving' }]
  });
  await testUser.save();

  console.log('Created test user. Now calling getMatches logic manually...');

  try {
    const req = { user: { id: testUser._id } };
    const res = {
      status: (code) => ({
        json: (data) => console.log('Response Status:', code, 'Data:', JSON.stringify(data, null, 2))
      })
    };
    
    await matchController.getMatches(req, res);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await User.findByIdAndDelete(testUser._id);
    mongoose.disconnect();
  }
};

testMatch();
