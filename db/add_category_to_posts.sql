-- Adiciona coluna de Categoria
ALTER TABLE posts 
ADD COLUMN category TEXT DEFAULT 'Mundo';

-- Adiciona coluna de Tags (Array de texto)
ALTER TABLE posts 
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Cria um índice para a busca ser rápida
CREATE INDEX posts_category_idx ON posts (category);
