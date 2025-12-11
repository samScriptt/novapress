ALTER TABLE posts 
ADD COLUMN category TEXT DEFAULT 'World';

ALTER TABLE posts 
ADD COLUMN tags TEXT[] DEFAULT '{}';

CREATE INDEX posts_category_idx ON posts (category);
