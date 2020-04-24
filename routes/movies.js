const auth = require('../middlewear/auth');
const mongoose = require('mongoose');
const router = require('express').Router();
const { Movie, validateMovie } = require('../models/movie');
const Genre = require('../models/genre');
const routeDebug = require('debug')('route:debug');
const Joi = require('joi');

//  Create
router.post('/', auth, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie)
})

//  Read All
router.get('/', async (req, res) => {
    const movies = await Movie.find();

    res.send(movies);
})

//  Read Specific
router.get('/:id', async (req, res) => {

})

//  Update
router.put('/:id', auth, async (req, res) => {

})

//  Delete
router.delete('/:id', auth, async (req, res) => {

})

module.exports = router;