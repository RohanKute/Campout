const express = require('express')
const router = express.Router();
const { storage } = require('../config/cloudinaryConfig');

const multer  = require('multer')
const upload = multer({ storage })

const  {validateSchema}  = require('../validation/SchemaValidate');
const { IsLoggedIn, storeReturnTo  } = require('../validation/auth/Islogged');

const isAuthorCamp = require('../validation/auth/isAuthorCamp');
const isAuthorReview = require('../validation/auth/isAuthorReview');

const { saveCamp, loadEditCampPage, updateCamp, deleteCamp, deleteReview } = require('../controllers/cudRoutes');

router.post('/savecamp' , IsLoggedIn , upload.array('image') , validateSchema, saveCamp);


router.get('/editcamp/:id' , IsLoggedIn , isAuthorCamp , loadEditCampPage);

// router.put('/updatecamp/:id' , IsLoggedIn, isAuthorCamp , upload.array('image'), updateCamp)
router.put('/updatecamp/:id' , IsLoggedIn, isAuthorCamp , upload.array('image'), validateSchema, updateCamp)


router.delete('/deletecamp/:id' , IsLoggedIn , isAuthorCamp, deleteCamp);

router.delete('/deletereview/:id' , IsLoggedIn , storeReturnTo, isAuthorReview, deleteReview);
module.exports = router;

