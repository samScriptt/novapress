DROP POLICY IF EXISTS "Enable insert for everyone" ON public.site_feedback;

CREATE POLICY "Only logged-in users can submit feedback" 
ON public.site_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can see their own feedback" 
ON public.site_feedback 
FOR SELECT 
USING (auth.uid() = user_id);