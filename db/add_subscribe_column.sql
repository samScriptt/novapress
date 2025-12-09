-- Adiciona campo de assinante
ALTER TABLE public.profiles 
ADD COLUMN is_subscriber BOOLEAN DEFAULT false;

-- Adiciona campo para ID do cliente Stripe (para cancelar depois se quiser)
ALTER TABLE public.profiles 
ADD COLUMN stripe_customer_id TEXT;