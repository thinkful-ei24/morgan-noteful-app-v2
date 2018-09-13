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

router.post('/', (req, res, next) => {});

router.put('/:id', (req, res, next) => {});

router.delete('/:id', (req, res, next) => {});

module.exports = router;