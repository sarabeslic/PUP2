const jwt=require('jsonwebtoken');
require('dotenv').config();
const bcrypt=require('bcrypt');
const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET;



function authenticateUser({ email, password }, users, res){

    const user = users.find(u => {
        return u.email ===email && u.password === password;});
    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ user_id: user.user_id, name: user.name }, ACCESS_TOKEN_SECRET);

        res.cookie('access_token_dogs', accessToken, {maxAge: 1*60*60*1000}); // 1 hour expiration
        res.redirect('/dogs');
        } else {
            res.sendStatus(401); // Unauthorized
        }};
    

      //------------------middleware function for checking the JWT token-------------------
function authenticateJWT(req, res, next) {
    console.log("Auntehtication")
    const token = req.cookies.access_token_dogs;
    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user; // Attach the entire user object to req.user
            next();
        });
    } else {
        // If no valid token is found, redirect to login page
        return res.redirect('/login');
    }
}



module.exports = {
    authenticateUser,
    authenticateJWT

}