-- Adiciona colunas para controle de visualização gratuita
ALTER TABLE public.profiles 
ADD COLUMN last_free_view_date DATE,
ADD COLUMN last_free_view_post_id BIGINT;