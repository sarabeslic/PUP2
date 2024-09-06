const express = require('express');
const cors = require('cors'); //for cross origin resource sharing means we can access the data from different domain!!!
const app = express();
const port = 3000; // Port for the backend server
//const port = 3306; 
const path = require('path');
const db = require('./services/database.js');
/*-----------------------------------------------------------------*/
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend origin
    credentials: true, // Allow cookies from the frontend
};
app.use(cors(corsOptions));


app.use(express.static('public')); // Serve static files from the 'public' directory


/*-----------------------------------------------------------------*/
// Middleware


const cookieParser = require('cookie-parser'); // Include cookie-parser middleware
app.use(cookieParser());

const bodyParser = require('body-parser'); // Include body-parser middleware to parse the request body
app.use(bodyParser.json()) //for json data 
app.use(bodyParser.urlencoded({ extended: true })); //for form data
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




/*-----------------------------------------------------------------*/

const dogsRoutes = require('./routes/dogs');
const homeRoutes = require('./routes/home');
const registerRoutes = require('./routes/register');
const userRoutes = require('./routes/user');
const matchRoutes = require('./routes/matches');

app.use('/user', userRoutes);
app.use('/dogs', dogsRoutes);
app.use('/register', registerRoutes);
app.use('/', homeRoutes); 
app.use('/matches', matchRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


/*
app.use(express.static(path.join(__dirname, '/dist'))); // Serve static files from the 'public' directory

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});


app.listen(port,() => {
    console.log(`App listening at ${port}`)
});

*/