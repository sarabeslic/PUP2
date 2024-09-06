const dogModel = require('../models/dogModel');
const userModel = require('../models/userModel');

const getDogs = (req, res) => {
    dogModel.getDogs()
        .then(dogs => {
            res.json(dogs);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}

const getUserDogData = (req, res) => {
    //const paramUserId = req.params.id; // Get user ID from request parameters 
    const userId = req.params.id; // Get authenticated user ID from JWT

    console.log('User ID for dog Profile:', userId);
    userModel.getUser(userId)
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}


const getMatchingDogs = (req, res) => {
    const userId = req.user.user_id; // Get authenticated user ID from JWT
    console.log('User ID:', userId);

    dogModel.getMatchingDogs(userId)
        .then(dogs => {
            res.json(dogs);
            console.log(`the matches formed ${dogs}`);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}


module.exports = { 
    getDogs,
    getUserDogData,
    getMatchingDogs
 };