-- vision_module_divisions: sub-items inside each journey module
CREATE TABLE IF NOT EXISTS vision_module_divisions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID        NOT NULL REFERENCES vision_project_modules(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  subtitle    TEXT,
  description TEXT        NOT NULL DEFAULT '',
  ord         INT         NOT NULL DEFAULT 0
);

ALTER TABLE vision_module_divisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_divisions" ON vision_module_divisions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM vision_project_modules m
    JOIN visionary_projects vp ON vp.id = m.project_id
    WHERE m.id = module_id AND vp.is_public = true
  )
);

CREATE POLICY "auth_all_divisions" ON vision_module_divisions FOR ALL USING (auth.role() = 'authenticated');
