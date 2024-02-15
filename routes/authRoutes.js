const express = require('express')
const router = express.Router();
const  {validateAsycFn} = require('../validation/ValidationAsync');
const {  storeReturnTo } = require('../validation/auth/Islogged');
const { signUpUser, authenticateUser, loginUser } = require('../controllers/authRoutes');


router.get('/login' , (req , res) =>{
          res.render('campgrounds/login');
})

router.get('/signup' , async(req , res) =>{
        res.render('campgrounds/signup');
})

router.post('/signup' ,validateAsycFn(signUpUser));

router.post('/login', storeReturnTo ,authenticateUser, loginUser);

router.get('/logout' , loginUser)

module.exports = router;


