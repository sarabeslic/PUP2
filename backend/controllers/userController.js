const userModel = require('../models/userModel');

const getUser = (req, res) => {
    //const paramUserId = req.params.id; // Get user ID from request parameters (if provided)
    const userId = req.user.user_id; // Get authenticated user ID from JWT

    console.log('User ID:', userId);
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
};


const getUsers = (req, res) => {
    userModel.getUsers()
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}


const updateProfile = (req, res) => {
    const userData = req.body;
    const userId = req.user.user_id; // Get user ID from decoded JWT token

    userModel.updateProfile(userId, userData) 
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });

};


const insertDogData = (req, res) => {
    const userId = req.user.user_id;  // for using the user_id from the JWT token
    const dogData = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    if (req.file) {
        dogData.dog_image = req.file.filename;
        console.log('File uploaded to:', req.file.filename);
    }

    userModel.insertDogData(userId, dogData)
        .then((result) => {
            const user = userModel.getUser(userId)
            .then((user) => {
                res.status(200).json({ message: "Dog data inserted successfully", data: user });
            });
        })
        .catch((err) => {
            console.error('Error inserting dog data:', err);
            res.status(500).json({ message: "Failed to insert dog data" });
        });
};



const updateDogInsertData = async (req, res) => {
    const userId = req.user.user_id; // Get user ID from decoded JWT token
    const dogData = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      if (req.file) {
        dogData.dog_image = req.file.filename; // Assuming Multer renames the file and stores its filename
        console.log('File uploaded to:', req.file.filename);
      }
  
      // Update dog data in userModel
      const result = await userModel.updateDogInsertData(userId, dogData);
  
      // Get updated user data
      const user = await userModel.getUser(userId);
  
      res.status(200).json({ message: "Dog data updated successfully", data: user });
    } catch (err) {
      console.error('Error updating dog data:', err);
      res.status(500).json({ message: "Failed to update dog data" });
    }
  };



  let deleteUserPermanently = (req, res) => {
    const userId = req.user.user_id;   // for using the user_id from the JWT token delete the user
    userModel.deleteUserPermanently(userId)
        .then(() => {
            res.status(200).json({ message: "User deleted successfully" });
        })
        .catch((err) => {
            console.error('Error deleting user:', err);
            res.status(500).json({ message: "Failed to delete user" });
        });
    };

  module.exports = { 
    getUser,
    getUsers,
    updateProfile,
    insertDogData,
    updateDogInsertData,
    deleteUserPermanently
  };

