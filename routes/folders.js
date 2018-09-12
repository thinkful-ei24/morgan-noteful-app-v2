// Initialize Knex to access DB
const knex = require('../knex');
// Initialize Express for routing
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json('hello!');
});

module.exports = router;