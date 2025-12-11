CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT CHECK (vote_type IN ('like', 'dislike')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can see the comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Anyone can see likes" ON public.likes FOR SELECT USING (true);

CREATE POLICY "Logged in can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Logged-in users can delete their comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Logged in can vote" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Logged in can change votes" ON public.likes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Logged-in users can remove votes" ON public.likes FOR DELETE USING (auth.uid() = user_id);