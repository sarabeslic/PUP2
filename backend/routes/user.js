const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel')
const userController = require('../controllers/userController');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const authenticationService = require('../services/authentication');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/dogImages');
    },
    
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
    })
  
  const upload = multer({ storage: storage });



router.use(authenticationService.authenticateJWT); // Check if user is authenticated

router.post('/', upload.single('dog_image'), userController.insertDogData); 
router.put('/', upload.single('dog_image'), userController.updateDogInsertData);
router.get('/', userController.getUser);



module.exports = router;