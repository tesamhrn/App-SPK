const express = require('express');
const router = express.Router();

const {loginPage} = require('../controllers/loginController');


router.get('/login', loginPage)

// router.post('/postCreate_Account', createAdminAccount)

// router.post('/postLogin_User', postLoginUser)
module.exports = router;