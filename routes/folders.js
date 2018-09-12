// Initialize Knex to access DB
const knex = require('../knex');
// Initialize Express for routing
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('folders')
    .then(dbResponse => {
      return res.status(200).json(dbResponse);
    })
    .catch(err => next(err));
});

module.exports = router;