-- psql -U dev -d noteful-app -f ./noteful-app.sql

-- Wipes table so this file can recreate it each time it is ran
DROP TABLE IF EXISTS notes;
DROP SEQUENCE IF EXISTS notes_id_seq;

-- Sequence from 1000 using Postgres 10.X identity generators
  -- CREATE TABLE notes (id int GENERATED ALWAYS AS IDENTITY (START WITH 1000) PRIMARY KEY, title text NOT NULL, content text, created timestamp with time zone default CURRENT_TIMESTAMP);

-- Sequence from 1000 using < Postgres 10.X 
CREATE SEQUENCE notes_id_seq INCREMENT 1 START 1000 CACHE 1;
CREATE TABLE notes (
  id integer NOT NULL DEFAULT nextval('notes_id_seq') PRIMARY KEY, 
  title text NOT NULL, 
  content text, 
  created timestamp with time zone default CURRENT_TIMESTAMP
  );


INSERT INTO notes (title, content) VALUES
  ('5 life lessons learned from cats', 'Lorem ipsum.'),
  ('What the government doesn''t want you to know about cats', 'Posuere sollicitudin aliquam.'),
  ('The most boring article about cats you''ll ever read', 'Lorem ipsum dolor.'),
  ('Cats are cool. Just kidding.', 'Posuere sollicitudin aliquam nisl.'),
  ('7 things lady gaga has in common with cats', 'Lorem id est laborum.'),
  ('The most incredible article about cats you''ll ever read', 'mollit anim id est laborum.'),
  ('We''re going to talk about dogs now', 'Lorem ipsum.'),
  ('What the government doesn''t want you to know about dogs', 'Posuere sollicitudin aliquam.'),
  ('The most exciting article about dogs you''ll ever read', 'Lorem ipsum dolor.'),
  ('Dogs are cool. Not just kidding.', 'Posuere sollicitudin aliquam nisl.'),
  ('7 things jesus has in common with dogs', 'Lorem id est laborum.'),
  ('Dogs dogs dogs dogs dogs. PUPPIES! Dogs.', 'mollit anim id est laborum.');

SELECT * FROM notes;

-- SELECT * FROM notes LIMIT 5;

-- SELECT * FROM NOTES ORDER BY title DESC LIMIT 5;

-- SELECT * FROM NOTES WHERE title = 'Dogs dogs dogs dogs dogs. PUPPIES! Dogs.';

-- SELECT * FROM NOTES WHERE title LIKE '%dog%';

-- UPDATE notes SET 
--   title = 'Dogs are taking over now.',
--   content = 'WOOF WOOF.'
--   WHERE id = 1;

-- INSERT INTO notes (title, content) VALUES (null, 'I AM EXCLUDING TITLE MUAHAHAHA!');
-- INSERT INTO notes (title, content) VALUES ('I AM EXCLUDING CONTENT MUAHAHAHA!', null);

-- DELETE FROM notes WHERE id = 5;