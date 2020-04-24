const validateObjectId = require('../middlewear/validateObjectId');
const auth = require('../middlewear/auth');
const admin = require('../middlewear/admin');
const router = require('express').Router();
const mongoose = require('mongoose');
const { Genre, validateGenre } = require('../models/genre');
const routeDebug = require('debug')('route:debug');
const Joi = require('joi');

// const genres = [
//     {  id: 1, name: 'action' },
//     {  id: 2, name: 'thriller' },
//     {  id: 3, name: 'horror' },
// ];

// Create
router.post('/', auth, async (req, res) => {
    // Client entry validation
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // read genres object that should be in the body of request
    // use property to create new genre object
    // const genre = { // in order for req.body.name to work, we need to enable parsing of json objects
    //     id: genres.length + 1, 
    //     name: req.body.name,
    // };

    // add the genre to our genres array
    // genres.push(genre);
    // res.send(genre); // id was created on server, we need to send this genre object back to the client

    // Logic using mongodb
        let genre = new Genre({
            name: req.body.name
        });
 
        genre = await genre.save();
        res.send(genre);
            
});

// Read all genres
router.get('/', async (req, res, next) => {
    // res.send(genres)
    // mongodb logic
    genres = await Genre.find().sort('name');
    res.send(genres)
});

// Read specific genre
router.get('/:id', validateObjectId, async (req, res) => {
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    // if (!genre) return res.status(404).send('The genre with the given id was not found');
    // res.send(genre);

    // Mongodb logic

    const genre = await Genre.findOne({ _id: req.params.id });
    if (!genre) return res.status(404).send('The genre with the given id was not found');
    res.send(genre);
});

// Update
router.put('/:id', [validateObjectId, auth], async (req, res) => {
    // Look up the course
    // If not existing, return 404
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    // if (!genre) return res.status(404).send('The genre with the given id was not found');

    // // Validate the course
    // // If invalid, return 400 - Bad Requst
    // const { error } = validateGenre(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // // Update course
    // genre.name = req.body.name;
    // // Return the updated course
    // res.send(genre);

    // Mongodb Logic
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send('The genre with the given id was not found');


    res.send(genre);

});

// Delete
router.delete('/:id', [auth, admin], async (req, res) => {
    //     const genre = genres.find(g => g.id === parseInt(req.params.id));
    //     if (!genre) return res.status(404).send('The genre with the given ID was not found');

    //    const index = genres.indexOf(genre);
    //    genres.splice(index, 1);
    //    res.send(genre);

    // Mongodb Logic
        const genre = await Genre.findByIdAndRemove({ _id: req.params.id });

        if (!genre) return await res.status(404).send('The genre with the given id was not found');

        res.send(genre);

});

module.exports = router;