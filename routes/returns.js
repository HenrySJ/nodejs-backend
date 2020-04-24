const router = require('express').Router();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { Rental } = require('../models/rental');
const validate = require('../middlewear/validate');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');
const auth = require('../middlewear/auth');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    
    if (!rental) return res.status(404).send('No rental found');

    if (rental.dateReturned) return res.status(400).send('This rental was already returned');

    rental.return();
    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return Joi.validate(req, schema);
}

module.exports = router;