const User = require('../models/User');
const TradeRequest = require('../models/Trade');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Toggle isActive
    user.isActive = !user.isActive;
    await user.save();
    
    res.status(200).json({ message: `User ${user.isActive ? 'unbanned' : 'banned'} successfully`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTrades = async (req, res) => {
  try {
    const trades = await TradeRequest.find({}).populate('senderId receiverId', 'name email');
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, toggleBanUser, getAllTrades };
