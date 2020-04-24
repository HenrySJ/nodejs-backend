const router = require('express').Router();
const mongoose = require('mongoose');
const {Customer} = require('../models/customer');
const { Movie } = require('../models/movie');
const auth = require('../middlewear/auth');
const { Rental, validateRental } = require('../models/rental');
const Fawn = require('fawn');
const routeDebug = require('debug')('route:db')

Fawn.init(mongoose);

// Create
router.post('/', auth, async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId).catch(() => {});
    const movie = await Movie.findById(req.body.movieId).catch(() => {});
    routeDebug(movie);

    if (!customer && !movie) return res.status(404).send(`Please enter a valid customer and movie`);
    if (!customer) return res.status(404).send(`Please enter a valid customer`);
    if (!movie) return res.status(404).send(`Please enter a valid movie`);

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    }
    catch(ex) {
        res.status(500).send('Something failed');
    }

});

// Read All
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.status(200).send(rentals);
});

module.exports = router;