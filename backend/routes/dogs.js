const express = require('express');
const router = express.Router();

const dogController = require('../controllers/dogController');

router.get('/', dogController.getDogs);
router.get('/:id', dogController.getUserDogData);

module.exports = router;