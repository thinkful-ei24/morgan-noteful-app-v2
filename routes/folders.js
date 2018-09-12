// Initialize Knex to access DB
const knex = require('../knex');
// Initialize Express for routing
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // SELECT FROM folders
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
  // SELECT FROM folders WHERE id = `id`
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
  // Validate that user entered name (required)
  if (!name) {
    const err = new Error('Missing `name` in request body.');
    err.status = 400;
    next(err);
  }
  // INSERT INTO folders (name)
  knex
    .insert({ name })
    .into('folders')
    .returning(['id', 'name'])
    .then(dbResponse => {
      if (!dbResponse.length) return next();
      else return res.status(201).json(dbResponse[0]);
    })
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const name = req.body.name;
  const id = req.params.id;
  // Validate that user entered name (required)
  if (!name) {
    const err = new Error('Missing `name` in request body.');
    err.status = 400;
    next(err);
  }
  // UPDATE folders (`name`) WHERE id = `id`
  knex('folders')
    .update({
      name
    })
    .where('id', id)
    .returning(['id', 'name'])
    .then(dbResponse => {
      if (!dbResponse.length) return next();
      else return res.status(200).json(dbResponse[0]);
    })
    .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  // DELETE FROM folders WHERE id = `id`
  knex
    .delete()
    .from('folders')
    .where('id', id)
    .then(dbResponse => {
      if (dbResponse === 0) return next();
      else res.status(204).end();
    })
    .catch(err => next(err));
});

module.exports = router;