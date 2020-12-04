const auth = require("../middlewear/auth");
const mongoose = require("mongoose");
const { Customer, validateCustomer } = require("../models/customer");
const router = require("express").Router();
const routeDebug = require("debug")("route:debug");
const Joi = require("joi");

// Create
router.post("/", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  customer = await customer.save();
  res.status(200).send(customer);
});

// Read all
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  if (customers.length < 1)
    return res.status(404).send("Could not find any customers");

  res.status(200).send(customers);
});

// Read Specific
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id).catch(() => {});
  if (!customer)
    return res.status(404).send("The customer with the given id was not found");

  res.status(200).send(customer);
});

// Update
router.put("/:id", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error)
    return res
      .status(400)
      .send("the character with the given id could not be found");

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).send(customer);
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id).catch(
    (err) => {
      return err;
    }
  );
  if (!customer)
    return res.status(404).send("The customer with the given id was not found");

  res.send(customer);
});

module.exports = router;
