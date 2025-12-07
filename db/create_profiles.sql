-- 1. Cria a tabela de perfis (vinculada ao auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilita segurança (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acesso:
-- Qualquer um pode ver os perfis (para ver quem comentou, por exemplo)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- O usuário pode inserir seu próprio perfil
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- O usuário pode atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING ((select auth.uid()) = id);