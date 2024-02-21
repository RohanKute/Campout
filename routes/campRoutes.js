const express = require('express')
const router = express.Router();
const  {validateAsycFn} = require('../validation/ValidationAsync');
const  { validateReviewSchema}  = require('../validation/SchemaValidate');
const { IsLoggedIn  } = require('../validation/auth/Islogged');
const { renderCamps, showCamp, createReview, loadCreatePage } = require('../controllers/campRoutes');

router.get('/' , renderCamps)

router.get('/campdetails/:id' , showCamp);

router.post('/campdetails/:id/review', IsLoggedIn, validateReviewSchema, validateAsycFn(createReview));

router.get('/createnew' , IsLoggedIn , loadCreatePage );

module.exports = router;




























































