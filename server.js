const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
require('dotenv').config({ path: './config.env' });

const allBooksController = require('./controllers/allBooksController');
const signupController = require('./controllers/signupController.js');
const signinController = require('./controllers/signinController.js');
const searchController = require('./controllers/searchController.js');
const bookController = require('./controllers/bookController.js');
const lendBookController = require('./controllers/lendBookController.js');
const myBooksController = require('./controllers/myBooksController.js');
const deleteFormularController = require('./controllers/deleteFormularController.js');

const app = express();

const pool = require("./db");
const sessionSecret = process.env.SESSION_SECRET || 'my-secret-key';

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true,
}));

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
}));

dotenv.config();

// POST 
app.post("/signup", signupController.signup);
app.post("/signin", signinController.signin);

app.post("/lend-book", (req, res, next) => {
    req.pool = pool;
    next();
}, lendBookController.lendBook);

// GET
app.get('/all', (req, res, next) => {
    req.pool = pool;
    next();
}, allBooksController.allBooks);

app.get('/search', (req, res, next) => {
    req.pool = pool;
    next();
}, searchController.searchBooks);

app.get('/book/:bookId', (req, res, next) => {
    req.pool = pool;
    next();
}, bookController.book);

app.get('/my-books', (req, res, next) => {
    req.pool = pool;
    next();
}, myBooksController.myBooks);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// DELETE

app.delete('/formulars/:id', deleteFormularController.deleteFormular);

// app.delete('/formulars/:formularId', (req, res, next) => {
//     req.pool = pool;
//     next();
// }, bookController.book);

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
