const express = require('express');
const router = express.Router();

const dogController = require('../controllers/dogController');
const authenticationService = require('../services/authentication');



router.use(authenticationService.authenticateJWT); // Check if user is authenticated

router.get('/', dogController.getMatchingDogs);


module.exports = router;    