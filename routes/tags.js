const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  knex
    .select(['id', 'name'])
    .from('tags')
    .then((dbResponse) => {
      res.status(200).json(dbResponse);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .select(['id', 'name'])
    .from('tags')
    .where('id', id)
    .then((dbResponse) => {
      if (!dbResponse.length) return next();
      else return res.status(200).json(dbResponse[0]);
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const item = {
    name: req.body.name
  };
  // Valid that name included in request body (required)
  if (!item.name) {
    const err = new Error('Missing `name` in request body.');
    err.status = 400;
    return next(err);
  }

  knex
    .insert(item)
    .into('tags')
    .returning(['id', 'name'])
    .then((dbResponse) => {
      return res.status(201).json(dbResponse);
    })
    .catch(err => {
      // Handle UNIQUE constraint violation
      if (err.code === '23505') {
        const error = new Error('This tag already exists.');
        error.status = 400;
        return next(error);
      }
      else return next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const item = {
    id: req.params.id,
    name: req.body.name
  };
  // Validate that request includes name in body (required)
  if (!item.name) {
    const err = new Error('Must include `name` in body.');
    err.status = 400;
    return next(err);
  }

  knex('tags')
    .update({ name: item.name })
    .where('id', item.id)
    .returning(['id', 'name'])
    .then((dbResponse) => {
      if (!dbResponse.length) return next();
      else return res.status(200).json(dbResponse[0]);
    })
    .catch(err => {
      // Handle UNIQUE constraint violation
      if (err.code === '23505') {
        const error = new Error('This tag already exists.');
        error.status = 400;
        return next(error);
      }
      else return next(err);
    });
});

router.delete('/:id', (req, res, next) => {});

module.exports = router;