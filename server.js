const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
require('dotenv').config({ path: './config.env' });

const allBooksController = require('./controllers/allBooksController');
const signupController = require('./controllers/signupController.js'); 
const signinController = require('./controllers/signinController.js'); 

const app = express();

const pool = require("./db");

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true,
}));
const sessionSecret = process.env.SESSION_SECRET || 'my-secret-key';
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  }));

app.post("/signup", signupController.signup);
app.post("/signin", signinController.signin);


dotenv.config();

app.get('/all', (req, res, next) => {
    req.pool = pool;
    next();
}, allBooksController.allBooks);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pool.connect((err, client, done) => {
    if (err) {
        console.log('PostgreSQL connection failed: ', err);
    } else {
        console.log('PostgreSQL connection successful');
        done();
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});