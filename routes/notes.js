'use strict';

const express = require('express');
const knex = require('../knex');

// Create an router instance (aka "mini-app")
const router = express.Router();


// Get All (and search by query)
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;

  knex.select('id', 'title', 'content')
    .from('notes')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// Get a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .select(['id', 'title', 'content'])
    .where('id', id)
    .then((dbRes) => {
      // Check to see if query returned something
      if (dbRes[0] === undefined) {
        next();
      } 
      else {
        // Grab the note from the response array so we can return an object
        const note = dbRes[0];
        res.status(200).json(note);
      }
    })
    .catch((e) => next(e));
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .update({
      title: updateObj.title,
      content: updateObj.content
    })
    .where('id', id)
    .returning(['id', 'title', 'content'])
    .then(item => {
      console.log(item);
      // Check to see if query returned anything
      if (item[0] === undefined) {
        const err = new Error('Incorrect `id` specified');
        err.status = 400;
        return next(err);
      }
      else res.status(200).json(item);
    })
    .catch(err => {
      next(err);
    });
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const input = {
    title: req.body.title, 
    content: req.body.content
  };
  /***** Never trust users - validate input *****/
  if (input.title === undefined) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .insert({
      title: input.title,
      content: input.content
    })
    .returning(['id', 'title', 'content'])
    .then((dbRes) => {
      if (dbRes[0] === undefined) {
        const err = new Error('Error adding new item to database');
        next(err);
      }
      else {
        res.status(201).json(dbRes);
      }
    })
    .catch(e => next(e));

});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  notes.delete(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
