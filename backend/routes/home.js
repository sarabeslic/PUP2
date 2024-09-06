const express = require('express');
const router = express.Router();
const authenticationService = require('../services/authentication');
const userModel = require('../models/userModel')
const userController = require('../controllers/userController')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


router.post('/login', (req, res, next) => {
        userModel.getUsers()
        .then((users) => {authenticationService.authenticateUser(req.body, users, res)
    })
        .catch((err) => {
        res.sendStatus(500)
    })
});

/*-------------------------------------------------------------------------------------------------------------------*/
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
  

router.use(authenticationService.authenticateJWT); // Check if user is authenticated for all routes below!!

router.put('/settings', upload.single('profile_pic'), async (req, res) => { // for updating user data in settings
    const userData = req.body; 

    if (req.file) {
        userData.profile_pic = req.file.filename; 
        console.log('File uploaded to:', req.file.filename); 
    }
    try {
        const user = await userModel.updateProfile(userData);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error in /settings route:', error);
        res.status(500).json({ message: error.message });
    }});
router.get('/settings', userController.getUser);


/*---------------------------------------------------------------------------------*/
router.delete('/settings', userController.deleteUserPermanently); 



router.get('/logout', (req, res) => {
    res.cookie('access_token_dogs', '', {maxAge: 0});
    res.redirect('/') // Redirect to home page after logging out
    })


module.exports = router;