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

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .select('id', 'name')
    .from('folders')
    .where('id', id)
    .then((dbResponse) => {
      if (!dbResponse.length) return next();
      else return res.status(200).json(dbResponse[0]);
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const name = req.body.name;

  // Validate name field (required)
  if (!name) {
    const err = new Error('Missing `name` in request body.');
    err.status = 400;
    next(err);
  }

  knex
    .insert({ name })
    .into('folders')
    .returning(['id', 'name'])
    .then(dbResponse => {
      if (!dbResponse.length) return next();
      else return res.status(201).json(dbResponse);
    })
    .catch(err => next(err));

});

module.exports = router;