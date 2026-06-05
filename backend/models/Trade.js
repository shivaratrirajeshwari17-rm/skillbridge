const mongoose = require('mongoose');

const tradeRequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed'], 
    default: 'pending' 
  },
  skillOffered: { type: String, required: true },
  skillWanted: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('TradeRequest', tradeRequestSchema);
