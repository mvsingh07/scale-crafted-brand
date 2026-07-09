-- Work merges into Services: rename any /work nav link to /services for mvsingh.
-- Only runs when a /work link exists, so it is safe to re-apply.

update identity_profile
set nav_links = (
  select jsonb_agg(
    case
      when elem->>'href' = '/work'
        then jsonb_set(jsonb_set(elem, '{href}', '"/services"'), '{label}', '"Services"')
      else elem
    end
    order by coalesce((elem->>'order')::int, 0)
  )
  from jsonb_array_elements(nav_links) elem
)
where username = 'mvsingh'
  and nav_links @> '[{"href": "/work"}]';
