/* * * * * * * * * * * * *
 * /api/notes/ endpoints *
 * * * * * * * * * * * * */

const express = require('express');
const knex = require('../knex');

// Create an router instance (aka "mini-app")
const router = express.Router();

// GET / with optional `searchTerm` and `folderId` parameters
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.folderId;
  // SELECT FROM notes LEFT JOIN folders ON notes.folder_id = folders.id
  // (if searchTerm) WHERE title LIKE %searchTerm%
  // (if folderId) WHERE folder_id = `folderId`
  knex
    .select([
      'notes.id', 'title', 'content',
      'folders.id as folderId', 
      'folders.name as folderName'
    ])
    .from('notes').leftJoin('folders', 'notes.folder_id', 'folders.id')
    // Optional searchTerm filter
    .modify(queryBuilder => {
      if (searchTerm) queryBuilder.where('title', 'like', `%${searchTerm}%`);
    })
    // Optional folderId filter
    .modify(queryBuilder => {
      if (folderId) queryBuilder.where('folder_id', folderId);
    })
    .orderBy('id')
    .then(dbResponse => res.status(200).json(dbResponse))
    .catch(err => next(err));
});

// GET /:id endpoint
router.get('/:id', (req, res, next) => {
  // Fetch ID from query URL
  const id = req.params.id;
  // SELECT FROM notes LEFT JOIN folders ON notes.folder_id = folder.id WHERE id = `id`
  knex
    .select([
      'notes.id', 'title', 'content',
      'folders.id as folderId', 
      'folders.name as folderName'
    ])
    .from('notes').leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where('notes.id', id)
    .then((dbResponse) => {
      if (!dbResponse.length) return next();
      else return res.status(200).json(dbResponse[0]);
    })
    .catch(err => next(err));
});

// PUT to update items by ID in `notes` table
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  // Validate that user entered title (required)
  if (!title) {
    const err = new Error('Missing `title` in request body.');
    err.status = 400;
    return next(err);
  }
  // UPDATE notes SET (title, content) WHERE id = `id`
  knex('notes')
    .update({
      title,
      content
    })
    .where('id', id)
    .returning(['id', 'title', 'content'])
    .then(dbResponse => {
      if (!dbResponse.length) return next();
      else return res.status(200).json(dbResponse[0]);
    })
    .catch(err => next(err));
});

// POST to / endpoint
router.post('/', (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Validate that user entered title (required)
  if (!title) {
    const err = new Error('Missing `title` in request body.');
    err.status = 400;
    return next(err);
  }
  // INSERT INTO notes (title, content)
  knex
    .insert({
      title,
      content
    })
    .into('notes')
    .returning(['id', 'title', 'content'])
    .then((dbResponse) => {
      if (!dbResponse.length) return next();
      else return res.status(201).json(dbResponse[0]);
    })
    .catch(err => next(err));

});

// DELETE from /id endpoint
router.delete('/:id', (req, res, next) => {
  // Fetch ID from request URL
  const id = req.params.id;
  // Query `notes` table
  knex('notes')
    .delete()
    .from('notes')
    .where('id', id)
    .then((dbResponse) => {
      if (dbResponse === 0) return next();
      else return res.status(204).end();
    })
    .catch(err => next(err));
});

module.exports = router;
