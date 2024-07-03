const express = require('express');
const { registerUsers, loginUsers, logoutUsers, setAvi, resetPassword, confirmReset, findUser, getAllUsers } = require('../controllers/usersController');

const router = express.Router();

router.post('/register', registerUsers);
router.post('/login', loginUsers);
router.get('/logout', logoutUsers);
router.post('/set-avatar', setAvi);
router.post('/password-reset', resetPassword);
router.post('/confirm-reset', confirmReset);
router.get('/find/:userId',findUser)
router.get('/:userId',getAllUsers)
//router.get('/:userId',getUsers)

module.exports = router