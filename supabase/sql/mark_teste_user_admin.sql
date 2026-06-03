-- Execute this in the Supabase SQL Editor to mark the test user as admin.
-- After running, sign out and sign in again so the JWT picks up the new app_metadata.

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin')
where email = 'teste@teste.com';
