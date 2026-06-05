# Skill Bridge 🤝

Skill Bridge is a modern, premium Peer-to-Peer (P2P) Skill Exchange Platform built using the MERN stack. It intelligently connects individuals who want to learn new skills with those who can teach them, fostering a completely non-monetary, knowledge-bartering community.

## 🚀 Features

- **Smart Matching Algorithm**: Automatically matches your offered skills with users who want to learn them, and vice versa.
- **Dynamic Fake Peers (For Testing)**: Generates 100% unique fake peers on-the-fly perfectly tailored to any obscure skill you add, ensuring you always have matches to interact with.
- **Real-Time Chat**: Integrated with `Socket.io` to allow instant messaging between connected peers.
- **Trade Requests**: Send, receive, accept, and reject skill trade proposals.
- **Premium UI/UX**: Designed with a sleek, animated, dark-mode aesthetic.
- **Admin Dashboard**: Manage platform users and monitor global trade statistics.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.

## 💻 Tech Stack

- **Frontend**: React.js (Vite), React Router, Context API, Vanilla CSS.
- **Backend**: Node.js, Express.js, Socket.io.
- **Database**: MongoDB & Mongoose ODM.
- **Authentication**: JSON Web Tokens (JWT).

## 📁 Project Structure

```
skillbridge/
├── backend/                # Node.js Express server
│   ├── config/             # Database connection logic
│   ├── controllers/        # Route controllers (Auth, Match, Trade, etc.)
│   ├── middleware/         # JWT Auth and Admin middlewares
│   ├── models/             # Mongoose schemas (User, Trade, Message, etc.)
│   ├── routes/             # Express API routes
│   ├── server.js           # Main backend entry point
│   └── seed.js             # Script to populate mock database users
└── frontend/               # React (Vite) application
    ├── src/
    │   ├── components/     # Reusable UI components (Navbar, Topbar, etc.)
    │   ├── context/        # Global AuthContext
    │   ├── pages/          # Full page views (Home, Profile, Matches, etc.)
    │   ├── utils/          # Axios instance config with interceptors
    │   ├── App.jsx         # App router and layout
    │   └── index.css       # Global design system
```

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables.

**Backend (`backend/.env`)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## 🛠️ How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivaratrirajeshwari17-rm/skillbridge.git
   cd skillbridge
   ```

2. **Install Backend Dependencies & Start**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Install Frontend Dependencies & Start**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **View the Application**
   Open `http://localhost:5173` in your browser.

## 🌱 Seeding the Database

If you want to populate your database with initial mock users to test the matching system:

```bash
cd backend
node seed.js
```

*This will insert 5 highly varied user profiles into your database.*

---
Built with 💜 for learners everywhere.
