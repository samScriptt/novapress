DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  extracted_username text;
BEGIN
  extracted_username := new.raw_user_meta_data ->> 'username';
  
  IF extracted_username IS NULL OR extracted_username = '' THEN
    extracted_username := split_part(new.email, '@', 1);
  END IF;

  INSERT INTO public.profiles (id, email, username)
  VALUES (
    new.id, 
    new.email, 
    extracted_username
  );
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();