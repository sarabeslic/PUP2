const db = require('../services/database').config;
const bcrypt = require('bcrypt');


function getUsers() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM dogUsers", function (err, users, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(users);
            }
        });
    });
}

//joining data from dogUsers, dogs and preferences tables!!--------------------------------------------------------------//
//we need all the data on the same page, so we are joining the data from three tables//
let getUser = (id) => new Promise((resolve, reject) => { //we are getting the user by id and combining the data from two tables
    const query = `
        SELECT 
            dogUsers.*, 
            dogs.about_us, 
            dogs.dog_name, 
            dogs.dog_image, 
            preferences.gender,
            preferences.size,
            preferences.breed,
            preferences.walks
        FROM 
            dogUsers 
        LEFT JOIN 
            dogs 
        ON 
            dogUsers.user_id = dogs.user_id 
        LEFT JOIN 
            preferences 
        ON 
            dogUsers.user_id = preferences.user_id 
        WHERE 
            dogUsers.user_id = ?`;

    db.query(query, [parseInt(id)], function (err, results, fields) {
        if (err) {
            reject(err);
        } else {
            const userData = results[0];
            resolve(userData);
            console.log(userData);
        }
    });
});


// Add a new user to the database for registration with optional profile image-------------------------------------------------------//
const addUser = (userData) => new Promise((resolve, reject) => {
    // Extract user data from the request body
    
    const { email, name, surname, password, location, age, profile_pic } = userData;

    // Use db.escape to escape each value
    const emailEscaped = db.escape(email);
    const nameEscaped = db.escape(name);
    const surnameEscaped = db.escape(surname);
    const passwordEscaped = db.escape(password);
    const locationEscaped = db.escape(location);
    const ageEscaped = db.escape(age);
    const profilePicEscaped = db.escape(profile_pic || ''); // Default to empty string if not provided

    const query = `INSERT INTO dogUsers (email, name, surname, password, location, age, profile_pic)
     VALUES (${emailEscaped}, ${nameEscaped}, ${surnameEscaped}, ${passwordEscaped}, ${locationEscaped}, ${ageEscaped}, ${profilePicEscaped})`;

    db.query(query, function (err, result) {
        if (err) {
            console.error('Error inserting user:', err);
            reject(err);
        } else {
            const userIdAbsolute = result.insertId; // Get the auto-generated user_id
            console.log(`Inserted user with user_id ${userIdAbsolute}`);
            resolve(userIdAbsolute); // Resolve with the user_id
        }
    });
});

/*_-----inserting the dog data for the first time and only allowed to the logged in user!-----------------*/
//user_id is the user_id from the dogUsers table, the main table that conects all the data from other tables

const insertDogData = (userIdAbsolute, dogData) => new Promise((resolve, reject) => {
    const { dog_name, about_us, dog_image, gender, size, breed, walks } = dogData;
 
    if (!dog_name || !about_us || !dog_image || !gender || !size) { // Ensure all required fields are provided!
        return reject(new Error('Required fields are missing.'));
    }
+
    db.beginTransaction(err => {
        if (err) {
            return reject(err);
        }

        const query = "INSERT INTO dogs (user_id, dog_name, about_us, dog_image) VALUES (?, ?, ?, ?)";
        const values = [userIdAbsolute, dog_name, about_us, dog_image]; //dog image needs to be uploaded

        db.query(query, values, (err, result) => {
            if (err) {
                return db.rollback(() => {
                    reject(err);
                });
            }

            const queryPreference = "INSERT INTO preferences (user_id, gender, size, breed, walks) VALUES (?, ?, ?, ?, ?)";
            const valuesPreference = [userIdAbsolute, gender, size, breed || " ", walks || " "];  //walks and breed are optional!!
            
            db.query(queryPreference, valuesPreference, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        reject(err);
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            reject(err);
                        });
                    }
                    resolve(result);
                });
            });
        });
    });
});

/*--------only logged in user can update the profile data!---------------------------------------------------------------------------------*/
let updateProfile = (data) => new Promise((resolve, reject) => {
    // Ensure all required fields are provided except for the profile picture

    let sql = `UPDATE dogUsers SET email = ${db.escape(data.email)}, name = ${db.escape(data.name)}, surname = ${db.escape(data.surname)}, password = ${db.escape(data.password)}, location = ${db.escape(data.location)}, age = ${db.escape(data.age)}`;

    if (data.profile_pic) { // If a new profile picture is provided, update it if not, keep the old one
        console.log('Profile Pic:', data.profile_pic);
        if (typeof data.profile_pic === 'string' && data.profile_pic.length > 0) {
            sql += `, profile_pic = '${data.profile_pic}'`; // Use without escaping if confirmed to be safe
        } else {
            console.error('Invalid profile_pic value:', data.profile_pic);
        }
    }

    sql += ` WHERE user_id = ${db.escape(data.user_id)}`;

    console.log('SQL Query:', sql);

    db.query(sql, function (err, result) {
        if (err) {
            console.error('Error updating user:', err);
            reject(err);
        } else {
            console.log(`Updated ${result.affectedRows} row(s)`);
            resolve(result); 
        }
    });
});


//-------function to update the dog data on a user profile which can be accesed only by the logged in user!----------------------------------------------//

const updateDogInsertData = (userIdAbsolute, dogData) => new Promise((resolve, reject) => {
    const { dog_name, about_us, dog_image, gender, size, breed, walks } = dogData;

    db.beginTransaction(err => { //to start the transaction and to make sure that all the data is updated at the same time
        //if not all the data is updated, the transaction will be rolled back
        if (err) {
            return reject(err);
        }

        // Update dog data in dogs table
        const queryDogs = `
            UPDATE dogs
            SET dog_name = ?, about_us = ?, dog_image = ?
            WHERE user_id = ?
        `;
        const valuesDogs = [dog_name, about_us, dog_image || '', userIdAbsolute];

        db.query(queryDogs, valuesDogs, (err, result) => { //query to update the dog data with values
            if (err) {
                return db.rollback(() => {
                    reject(err);
                });
            }

            // Update preferences data in preferences  table
            const queryPreferences = `
                UPDATE preferences
                SET gender = ?, size = ?, breed = ?, walks = ?
                WHERE user_id = ?
            `;
            const valuesPreferences = [gender, size, breed, walks, userIdAbsolute];

            db.query(queryPreferences, valuesPreferences, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        reject(err);
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            reject(err);
                        });
                    }
                    resolve(result);
                });
            });
        });
    });
});

/*-----Deleting user from all databases based on user_id--------------------------------------------------------------------------------------*/

let deleteUserPermanently = (userIdAbsolute) => new Promise((resolve, reject) => {
    console.log(userIdAbsolute);
        
        db.beginTransaction(function (err) {    
            if (err) { 
                reject(err);
            }

            db.query("DELETE FROM dogUsers WHERE user_id = ?", [userIdAbsolute], function (err, result) {
                if (err) {
                    return db.rollback(function () {
                        reject(err);
                    });
                }

                console.log(`Deleted ${result.affectedRows} row(s) with user_id ${userIdAbsolute} in dogUsers`);
                db.query("DELETE FROM dogs WHERE user_id = ?", [userIdAbsolute], function (err, result) {
                    if (err) {
                        return db.rollback(function () {
                            reject(err);
                        });
                    }

                    console.log(`Deleted ${result.affectedRows} row(s) with user_id ${userIdAbsolute} in dogs`);
                    db.query("DELETE FROM preferences WHERE user_id = ?", [userIdAbsolute], function (err, result) {
                        if (err) {
                            return db.rollback(function () {
                                reject(err);
                            });
                        }

                        db.commit(function (err) {
                            if (err) {
                                return db.rollback(function () {
                                    reject(err);
                                });
                            }
                            resolve(result);
                            console.log(`Deleted ${result.affectedRows} row(s) with user_id ${userIdAbsolute}`);
                        });
                    });
                });
            });
        });
    });




module.exports = {
    getUser,
    addUser,
    getUsers,
    insertDogData,
    updateProfile,
    updateDogInsertData, // Ensure this function is being exported correctly
    deleteUserPermanently

};
