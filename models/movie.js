const mongoose = require('mongoose');
const genreSchema = require('./genre');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: { type: Number, default: '0' },
    dailyRentalRate: { type: Number, default: '0' }
});

const Movie = mongoose.model('Movie', movieSchema);

exports.validateMovie = function validateMovie(movie) {
    const schema = {
        title: Joi.string().required(),
        genreId: Joi.ObjectId().required(),
        numberInStock: Joi.string().required(),
        dailyRentalRate: Joi.string().required()
    };
    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;