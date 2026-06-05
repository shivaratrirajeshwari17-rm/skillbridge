const express = require('express');
const router = express.Router();
const { getMe, updateProfile, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/:id', protect, getUserById);

module.exports = router;
