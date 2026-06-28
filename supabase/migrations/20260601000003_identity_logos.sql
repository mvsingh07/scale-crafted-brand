-- Set logo and favicon URLs for identity_profile
update public.identity_profile
set
  logo_dark_url  = '/dark_mode_logo.png',
  logo_light_url = '/light_mode_logo.png',
  favicon_url    = '/dark_mode_logo.png'
where username = 'mvsingh';
