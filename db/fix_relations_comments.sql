-- 1. Remove a referência antiga (que apontava para auth.users)
ALTER TABLE public.comments
DROP CONSTRAINT comments_user_id_fkey;

-- 2. Cria a nova referência apontando para a tabela profiles
ALTER TABLE public.comments
ADD CONSTRAINT comments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 3. Vamos fazer o mesmo para a tabela likes (preventivo)
ALTER TABLE public.likes
DROP CONSTRAINT likes_user_id_fkey;

ALTER TABLE public.likes
ADD CONSTRAINT likes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;