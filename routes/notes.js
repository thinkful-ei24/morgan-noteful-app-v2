/* * * * * * * * * * * * *
 * /api/notes/ endpoints *
 * * * * * * * * * * * * */

const express = require('express');
const knex = require('../knex');

// Create an router instance (aka "mini-app")
const router = express.Router();

// GET / with optional `searchTerm` parameter
router.get('/', (req, res, next) => {
  // Fetch search term from query URL
  const searchTerm = req.query.searchTerm;
  // Query 'notes' table
  knex('notes')
    // if a user searches, add filter to query
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .select('id', 'title', 'content')
    .orderBy('notes.id')
    .then(results => {
      if (results.length === 0) return next();
      else return res.status(200).json(results);
    })
    .catch(err => next(err));
});

// GET /:id endpoint
router.get('/:id', (req, res, next) => {
  // Fetch ID from query URL
  const id = req.params.id;
  // Query 'notes' table
  knex('notes')
    .where('id', id)
    .select(['id', 'title', 'content'])
    .then((dbResponse) => {
      // Check to see if query returned something
      if (dbResponse.length === 0) return next();
      else {
        // Grab the note from the response array so we can return an object
        const note = dbResponse[0];
        return res.status(200).json(note);
      }
    })
    .catch(err => next(err));
});

// PUT to update items by ID in `notes` table
router.put('/:id', (req, res, next) => {
  // Fetch ID from query URL 
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const userInput = {
    title: req.body.title,
    content: req.body.content
  };

  // Validate that user entered title (required)
  if (userInput.title === undefined) {
    const err = new Error('Missing `title` in request body.');
    err.status = 400;
    return next(err);
  }

  // Update note from 'notes' table using ID
  knex('notes')
    .where('id', id)
    .update({
      title: userInput.title,
      content: userInput.content
    })
    .returning(['id', 'title', 'content'])
    .then(dbResponse => {
      // Check to see if query returned anything
      if (dbResponse.length === 0) return next();
      else return res.status(200).json(dbResponse);
    })
    .catch(err => next(err));
});

// POST to / endpoint
router.post('/', (req, res, next) => {
  // Fetch title, content from request body
  const userInput = {
    title: req.body.title, 
    content: req.body.content
  };
  // Validate that user entered title (required)
  if (userInput.title === undefined) {
    const err = new Error('Missing `title` in request body.');
    err.status = 400;
    return next(err);
  }
  // Query `notes` table
  knex('notes')
    .insert({
      title: userInput.title,
      content: userInput.content
    })
    .returning(['id', 'title', 'content'])
    .then((dbResponse) => {
      if (dbResponse.length === 0) return next();
      else return res.status(201).json(dbResponse);
    })
    .catch(err => next(err));

});

// DELETE from /id endpoint
router.delete('/:id', (req, res, next) => {
  // Fetch ID from request URL
  const id = req.params.id;
  // Query `notes` table
  knex('notes')
    .where('id', id)
    .delete()
    .then((dbResponse) => {
      // Check if DB did not delete anything 
      // (SQL returns # of items deleted here)
      if (dbResponse === 0) return next();
      else return res.sendStatus(204);
    })
    .catch(err => next(err));
});

module.exports = router;
