const express = require('express');
const root = require('../routes/root');
const genres = require('../routes/genres')
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const returns = require('../routes/returns');
const auth = require('../routes/auth');
const error = require('../middlewear/error');

module.exports = function(app) {
    app.use(express.json()); // Parses body of req, if there's a JSON object, populates req.body property
    app.use(express.urlencoded({ extended: true })); // Parses incoming req's w/ url encoded payloads (key=value&key=value)                 extended: true allows the parsing of complex objects
    app.use(express.static('public')) // A folder as an argument; contains all our static assest: css and images etc.
    app.use('/api/genres', genres);
    app.use('/', root);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/returns', returns);
    app.use(error);
}