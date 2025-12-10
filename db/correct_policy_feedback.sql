-- Remove a política antiga "aberta geral"
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.site_feedback;

-- Cria nova política restritiva
CREATE POLICY "Apenas logados podem enviar feedback" 
ON public.site_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver seus próprios feedbacks" 
ON public.site_feedback 
FOR SELECT 
USING (auth.uid() = user_id);