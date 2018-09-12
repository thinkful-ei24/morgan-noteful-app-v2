-- psql -U dev -d noteful-app -f ./noteful-app.sql

-- Wipes table so this file can recreate it each time it is ran
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;


CREATE TABLE folders (
  id int GENERATED ALWAYS AS IDENTITY (START WITH 100) PRIMARY KEY,
  name text NOT NULL
);

INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

-- SELECT * FROM folders;


-- Sequence from 1000 using Postgres 10.X identity generators
CREATE TABLE notes (
  id int GENERATED ALWAYS AS IDENTITY (START WITH 1000) PRIMARY KEY, 
  title text NOT NULL, 
  content text, 
  created timestamp default now(),
  folder_id int REFERENCES folders(id) ON DELETE SET NULL
);


INSERT INTO notes (title, content, folder_id) VALUES
  ('5 life lessons learned from cats', 'Lorem ipsum.', 102),
  ('What the government doesn''t want you to know about cats', 'Posuere sollicitudin aliquam.', 102),
  ('The most boring article about cats you''ll ever read', 'Lorem ipsum dolor.', 102),
  ('Cats are cool. Just kidding.', 'Posuere sollicitudin aliquam nisl.', 102),
  ('7 things lady gaga has in common with cats', 'Lorem id est laborum.', 102),
  ('The most incredible article about cats you''ll ever read', 'mollit anim id est laborum.', 102),
  ('What the government doesn''t want you to know about dogs', 'Posuere sollicitudin aliquam.', 102),
  ('The most exciting article about dogs you''ll ever read', 'Lorem ipsum dolor.', 102),
  ('Dogs are cool. Not just kidding.', 'Posuere sollicitudin aliquam nisl.', 102),
  ('7 things jesus has in common with dogs', 'Lorem id est laborum.', 102);
  
INSERT INTO notes (title, content) VALUES
  ('We''re going to talk about dogs now', 'Lorem ipsum.'),
  ('Dogs dogs dogs dogs dogs. PUPPIES! Dogs.', 'mollit anim id est laborum.');

-- SELECT * FROM notes;

-- get all notes with folders
-- SELECT * FROM notes
-- INNER JOIN folders ON notes.folder_id = folders.id;

-- get all notes, show folders if they exists otherwise null
-- SELECT * FROM notes
-- LEFT JOIN folders ON notes.folder_id = folders.id;

-- get all notes, show folders if they exists otherwise null
-- SELECT * FROM notes
-- LEFT JOIN folders ON notes.folder_id = folders.id
-- WHERE notes.id = 1005;

-- SELECT * FROM folders where id = 102;