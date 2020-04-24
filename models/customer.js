const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: { type: Boolean, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 11 }
});

const Customer = mongoose.model('Customer', customerSchema);

// validation function
exports.validateCustomer = function validateCustomer(customer) {
    const schema = {
        isGold: Joi.string().required(),
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(10).max(11).required()
    };
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;