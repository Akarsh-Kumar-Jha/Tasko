const express = require('express');
const router = express.Router();

const {registerUser,login,TokenRefresh, verifyAndCreate, IsUser} = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register',registerUser);
router.post('/verify-otp',verifyAndCreate);
router.post('/login',login);
router.post('/refresh-token',TokenRefresh);
router.get('/get-user',authMiddleware,IsUser);


module.exports = router;