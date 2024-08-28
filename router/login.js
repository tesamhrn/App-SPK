const express = require('express');
const router = express.Router();

const {loginPage, postCreateAccount , postLogin} = require('../controllers/loginController');


router.get('/', loginPage)

router.post('/create_account', postCreateAccount)
router.post('/login_', postLogin)



// router.get('/logut', (req,res)=>{
    
// })

// router.post('/postLogin_User', postLoginUser)
module.exports = router;