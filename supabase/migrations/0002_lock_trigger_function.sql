-- The trigger function only runs as a trigger; nobody should be able to call it over the API.
revoke all on function public.limit_children() from public, anon, authenticated;
