const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { addUser } = require('../models/userModel');

/*--------------------------------------------------------------------------------------------*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = uuidv4();
      cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

/*--------------------------------------------------------------------------------------------*/

router.post('/', upload.single("profileImage"), async (req, res) => {
    const userData = req.body; // Get user data from request body
    // If you need to add the file path to the user data 
   
    if (req.file) {
        userData.profile_pic = req.file.filename; // Add the file name to the user data
        console.log('File uploaded to:', req.file.filename); // Log the file path
    }
    
    try {
        const user = await addUser(userData);
        console.log('User added:', user); // Log the added user data
        res.status(200).json({}); // Respond with the added user data
        
    } catch (error) {
        console.error('Error in /register route:', error); // Log detailed error
        res.status(500).json({ message: error.message });
    }

});


module.exports = router;
