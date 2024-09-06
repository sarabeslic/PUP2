require('dotenv').config();
const mysql = require('mysql2');

/*
const config = mysql.createConnection({   //create a connection to the database
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

config.connect(function(err) {     //connect to the database
    if (err) throw err;
    console.log("successfully connected!");
});

*/

const config = mysql.createConnection({   //create a connection to the database
    host: "atp.fhstp.ac.at",
    port: 8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "cc231036",
});

config.connect(function(err) {     //connect to the database
    if (err) throw err;
    console.log("successfully connected!");
});

module.exports = {config};

