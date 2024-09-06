const db = require('../services/database').config;

//-------------gets all the dogs from the database------------------------------------------------//
let getDogs = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM dogs", function (err, dogs, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(dogs)
        }
    })
})


//-------------matches the dogs based on the preferences of the user, only the mandatory preferences are matched since using all would not give many results since I dont have that big of a dataset
const getMatchingDogs = (userId) => new Promise((resolve, reject) => {
    const query = `
        SELECT 
            dogs.user_id,
            dogs.dog_image,
            dogs.dog_name,
            preferences.gender,
            preferences.size,
            preferences.breed,
            preferences.walks
        FROM 
            dogs 
        INNER JOIN 
            preferences 
        ON 
            dogs.user_id = preferences.user_id 
        CROSS JOIN 
            (SELECT gender, size, breed, walks FROM preferences WHERE user_id = ?) AS user_preferences
        WHERE 
            dogs.user_id != ? 
        AND 
            (preferences.gender = user_preferences.gender)
        AND
            (preferences.size = user_preferences.size)
    `;
    console.log(`Fetching matches for user ID: ${userId}`);
    db.query(query, [userId, userId], function (err, results, fields) {
        if (err) {
            reject(err);
            console.error('Error fetching matches:', err);
        } else {
            resolve(results);
            console.log(`Matches found:`, results);
        }
    });
});



module.exports = { 
    getDogs,
    getMatchingDogs
};