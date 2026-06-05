const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const dummyUsers = [
  {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Senior Frontend Developer looking to learn more about backend systems and databases.',
    location: 'San Francisco, CA',
    skillsOffered: [
      { skillName: 'React', proficiencyLevel: 'expert' },
      { skillName: 'JavaScript', proficiencyLevel: 'expert' },
      { skillName: 'CSS', proficiencyLevel: 'expert' }
    ],
    skillsWanted: [
      { skillName: 'Node.js', proficiencyLevel: 'beginner' },
      { skillName: 'MongoDB', proficiencyLevel: 'beginner' }
    ]
  },
  {
    name: 'Maria Chen',
    email: 'maria@example.com',
    password: 'password123',
    bio: 'Backend Engineer who wants to get better at UI/UX design and frontend development.',
    location: 'New York, NY',
    skillsOffered: [
      { skillName: 'Node.js', proficiencyLevel: 'expert' },
      { skillName: 'MongoDB', proficiencyLevel: 'expert' },
      { skillName: 'Python', proficiencyLevel: 'intermediate' }
    ],
    skillsWanted: [
      { skillName: 'React', proficiencyLevel: 'beginner' },
      { skillName: 'Figma', proficiencyLevel: 'beginner' },
      { skillName: 'UI Design', proficiencyLevel: 'beginner' }
    ]
  },
  {
    name: 'Jake Kim',
    email: 'jake@example.com',
    password: 'password123',
    bio: 'Product Designer looking to learn how to code my own prototypes.',
    location: 'Austin, TX',
    skillsOffered: [
      { skillName: 'Figma', proficiencyLevel: 'expert' },
      { skillName: 'UI Design', proficiencyLevel: 'expert' },
      { skillName: 'UX Research', proficiencyLevel: 'expert' }
    ],
    skillsWanted: [
      { skillName: 'HTML', proficiencyLevel: 'beginner' },
      { skillName: 'CSS', proficiencyLevel: 'beginner' },
      { skillName: 'JavaScript', proficiencyLevel: 'beginner' }
    ]
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'Data Scientist hoping to improve my web development skills to build better dashboards.',
    location: 'London, UK',
    skillsOffered: [
      { skillName: 'Python', proficiencyLevel: 'expert' },
      { skillName: 'Machine Learning', proficiencyLevel: 'expert' },
      { skillName: 'Data Analysis', proficiencyLevel: 'expert' }
    ],
    skillsWanted: [
      { skillName: 'React', proficiencyLevel: 'beginner' },
      { skillName: 'JavaScript', proficiencyLevel: 'intermediate' }
    ]
  },
  {
    name: 'David Okafor',
    email: 'david@example.com',
    password: 'password123',
    bio: 'Digital Marketer wanting to learn basic coding, can teach SEO and growth strategies in return.',
    location: 'Toronto, CA',
    skillsOffered: [
      { skillName: 'SEO', proficiencyLevel: 'expert' },
      { skillName: 'Digital Marketing', proficiencyLevel: 'expert' },
      { skillName: 'Copywriting', proficiencyLevel: 'expert' }
    ],
    skillsWanted: [
      { skillName: 'Python', proficiencyLevel: 'beginner' },
      { skillName: 'Data Analysis', proficiencyLevel: 'beginner' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    console.log('Clearing existing users...');
    await User.deleteMany({ role: 'user' }); // Keep admins if any, but clear normal users

    console.log('Hashing passwords and preparing data...');
    const hashedUsers = await Promise.all(dummyUsers.map(async (u) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    }));

    console.log('Inserting dummy users...');
    await User.insertMany(hashedUsers);

    console.log('Successfully seeded database with dummy users!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
