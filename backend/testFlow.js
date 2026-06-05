const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testFlow = async () => {
  try {
    const baseURL = 'http://localhost:5000/api';

    // 1. Register
    const email = `testuser_${Date.now()}@test.com`;
    console.log('Registering user...');
    let res = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Integration Test User', email, password: 'password123' })
    });
    let data = await res.json();
    const token = data.token;
    console.log('Registered successfully. Token:', token.substring(0, 10) + '...');

    // 2. Add skills
    console.log('Updating profile with skills...');
    res = await fetch(`${baseURL}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        skillsOffered: [{ skillName: 'React', proficiencyLevel: 'expert' }],
        skillsWanted: [{ skillName: 'GraphQL', proficiencyLevel: 'beginner' }]
      })
    });
    await res.json();
    console.log('Profile updated.');

    // 3. Get matches
    console.log('Fetching matches...');
    res = await fetch(`${baseURL}/match`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    
    console.log(`Found ${data.length} matches.`);
    data.forEach((m, i) => {
      console.log(`Match ${i+1}: ${m.user.name} | Score: ${m.matchScore}`);
      console.log(`  They offer: ${m.user.skillsOffered.map(s => s.skillName).join(', ')}`);
      console.log(`  They want: ${m.user.skillsWanted.map(s => s.skillName).join(', ')}`);
    });

  } catch (err) {
    console.error('Error during flow:', err.message);
  }
};

testFlow();
