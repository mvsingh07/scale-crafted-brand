-- visionary_projects: top-level vision projects
CREATE TABLE IF NOT EXISTS visionary_projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  username    TEXT        NOT NULL DEFAULT 'mvsingh',
  title       TEXT        NOT NULL,
  subtitle    TEXT,
  live_url    TEXT,
  description TEXT        NOT NULL DEFAULT '',
  ord         INT         NOT NULL DEFAULT 0,
  is_public   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- vision_project_modules: journey steps per project
CREATE TABLE IF NOT EXISTS vision_project_modules (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID        NOT NULL REFERENCES visionary_projects(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  subtitle    TEXT,
  description TEXT        NOT NULL DEFAULT '',
  ord         INT         NOT NULL DEFAULT 0
);

-- RLS
ALTER TABLE visionary_projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_project_modules  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_projects"  ON visionary_projects      FOR SELECT USING (is_public = true);
CREATE POLICY "auth_all_projects"     ON visionary_projects      FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "public_read_modules"   ON vision_project_modules  FOR SELECT USING (
  EXISTS (SELECT 1 FROM visionary_projects vp WHERE vp.id = project_id AND vp.is_public = true)
);
CREATE POLICY "auth_all_modules"      ON vision_project_modules  FOR ALL    USING (auth.role() = 'authenticated');

-- Seed: Human Potential Ecosystem
WITH proj AS (
  INSERT INTO visionary_projects (username, title, subtitle, live_url, description, ord, is_public)
  VALUES (
    'mvsingh',
    'Human Potential Ecosystem',
    NULL,
    NULL,
    'A holistic framework for human development — from how we nourish the body to how we discover purpose. Six interconnected pillars, each building on the last.',
    0,
    true
  )
  RETURNING id
)
INSERT INTO vision_project_modules (project_id, title, subtitle, description, ord)
SELECT proj.id, m.title, m.subtitle, m.description, m.ord
FROM proj,
(VALUES
  ('Ahara',   'Nourish the Body',      'Food, nutrition, and dietary practices that fuel peak performance and wellbeing. What we put in determines what comes out.',        0),
  ('Vihara',  'Build Healthy Habits',  'Establishing rhythms, routines, and environments that make good behaviour inevitable. Structure creates freedom.',                  1),
  ('Sharira', 'Strengthen the Body',   'Physical training, movement, and recovery for a resilient, capable body. The body is the vessel for everything else.',              2),
  ('Manas',   'Train the Mind',        'Mental clarity, focus, emotional regulation, and psychological fitness. A trained mind is the ultimate tool.',                      3),
  ('Buddhi',  'Expand Understanding',  'Learning, reading, reflection, and expanding the models through which we see the world. Wisdom compounds.',                         4),
  ('Atma',    'Discover Purpose',      'Meaning, identity, values, and the deep questions that anchor a life well-lived. Purpose gives direction to everything above it.',  5)
) AS m(title, subtitle, description, ord);
