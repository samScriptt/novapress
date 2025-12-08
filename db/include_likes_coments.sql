-- 1. Tabela de Comentários
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Likes/Dislikes
CREATE TABLE public.likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT CHECK (vote_type IN ('like', 'dislike')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id) -- Garante apenas 1 voto por usuário por post
);

-- 3. Segurança (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura (Públicas)
CREATE POLICY "Qualquer um pode ver comentários" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode ver likes" ON public.likes FOR SELECT USING (true);

-- Políticas de Escrita (Apenas Logados)
CREATE POLICY "Logados podem comentar" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Logados podem deletar seus comentários" ON public.comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Logados podem votar" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Logados podem mudar voto" ON public.likes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Logados podem remover voto" ON public.likes FOR DELETE USING (auth.uid() = user_id);