ALTER TABLE public.profiles 
ADD COLUMN is_subscriber BOOLEAN DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN stripe_customer_id TEXT;