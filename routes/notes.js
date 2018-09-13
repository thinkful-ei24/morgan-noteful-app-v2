/* * * * * * * * * * * * *
 * /api/notes/ endpoints *
 * * * * * * * * * * * * */
const knex = require('../knex');
const hydrateNotes = require('../utils/hydrateNotes');
// Create an router instance (aka "mini-app")
const express = require('express');
const router = express.Router();

const getNoteById = (id = null) => {
  return knex
    .select([
      'notes.id', 'title', 'content',
      'folders.id as folderId', 
      'folders.name as folderName',
      'tags.id as tagId',
      'tags.name as tagName'
    ])
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'note_id')
    .leftJoin('tags', 'tag_id', 'tags.id')
    .modify(queryBuilder => {
      if (id) {
        queryBuilder.andWhere('notes.id', id);
      }
    });
};

// GET / with optional `searchTerm` and `folderId` parameters
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.folderId;
  const tagId = req.query.tagId;

  getNoteById()
    // Optional filters
    .modify(queryBuilder => {
      if (searchTerm) queryBuilder.andWhere('title', 'like', `%${searchTerm}%`);
      if (folderId) queryBuilder.andWhere('folder_id', folderId);
      if (tagId) queryBuilder.andWhere('tag_id', tagId);
    })
    .orderBy('id')
    .then(dbResponse => {
      res.status(200).json(hydrateNotes(dbResponse));
    })
    .catch(err => next(err));
});

// GET /:id endpoint
router.get('/:id', (req, res, next) => {
  // Fetch ID from query URL
  const id = req.params.id;
  // SELECT FROM notes LEFT JOIN folders ON notes.folder_id = folder.id WHERE id = `id`
  getNoteById(id)
    .then((dbResponse) => {
      if (!dbResponse.length) return next();
      else return res.status(200).json(hydrateNotes(dbResponse)[0]);
    })
    .catch(err => next(err));
});

// PUT to update items by ID in `notes` table
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const folder_id = req.body.folderId || null;
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
      content,
      folder_id
    })
    .where('id', id)
    .returning('id')
    .then(dbResponse => {
      return knex
        .select([
          'notes.id', 'title', 'content',
          'folders.id as folderId',
          'folders.name as folderName' 
        ])
        .from('notes').leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', dbResponse[0]);
    })
    .then(dbResponse => {
      const result = dbResponse[0];
      if (!dbResponse.length) return next();
      else return res.location(`${req.originalUrl}/${result.id}`).status(200).json(result);
    })
    .catch(err => next(err));
});

// POST to / endpoint
router.post('/', (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const folderId = req.body.folderId || null;
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
      content,
      folder_id: folderId
    })
    .into('notes')
    .returning('id')
    // Using the id generated from inserting a note into `notes`,
    // left join to grab the corresponding folder information
    .then((dbResponse) => {
      // SELECT FROM notes LEFT JOIN folders ON notes.folder_id = folders.id
      // WHERE notes.id = `noteId`
      return knex
        .select([
          'notes.id', 'title', 'content', 
          'folder_id as folderId', 
          'folders.name as folderName'
        ])
        .from('notes').leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', dbResponse[0]);
    })
    .then((dbResponse) => {
      const result = dbResponse[0];
      console.dir(res.location);
      console.log(`${req.originalUrl}/${result.id}`);
      if (!dbResponse.length) return next();
      else return res.location(`${req.originalUrl}/${result['id']}`).status(201).json(result);
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

// TODO: Add error handler for UNIQUE violations

module.exports = router;
