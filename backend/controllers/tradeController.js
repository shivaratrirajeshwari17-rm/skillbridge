const TradeRequest = require('../models/Trade');

const sendRequest = async (req, res) => {
  try {
    const { receiverId, message, skillOffered, skillWanted } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const trade = await TradeRequest.create({
      senderId,
      receiverId,
      message,
      skillOffered,
      skillWanted
    });

    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSentRequests = async (req, res) => {
  try {
    const requests = await TradeRequest.find({ senderId: req.user.id }).populate('receiverId', 'name photo email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const requests = await TradeRequest.find({ receiverId: req.user.id }).populate('senderId', 'name photo email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const trade = await TradeRequest.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: 'Trade request not found' });
    }

    // Ensure only the receiver can accept/reject, or either can complete
    if (trade.receiverId.toString() !== req.user.id && trade.senderId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    trade.status = status;
    await trade.save();
    
    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendRequest, getSentRequests, getReceivedRequests, updateRequestStatus };
