const express = require('express');
const router = express.Router();
const { getAllUsers, toggleBanUser, getAllTrades } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/ban', protect, admin, toggleBanUser);
router.get('/trades', protect, admin, getAllTrades);

module.exports = router;
