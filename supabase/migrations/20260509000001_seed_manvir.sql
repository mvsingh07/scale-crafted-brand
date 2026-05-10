-- Seed Manvir's portfolio data into the dynamic tables.
-- Looks up the auth user by email so no hardcoded UUID is needed.

DO $$
DECLARE
  v_user_id  uuid;
  v_profile_id uuid;
BEGIN
  SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'mvsinghsays@gmail.com'
    LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User not found — skipping seed. Run after the admin user is created.';
    RETURN;
  END IF;

  -- ── Profile ────────────────────────────────────────────────────────────────
  INSERT INTO profiles (
    user_id, username, name, tagline, identity_stripe, hero_description,
    about_paragraphs, email, phone, linkedin_url, github_url
  ) VALUES (
    v_user_id,
    'manvir',
    'Manvir Singh',
    'Visionary Mind: Igniting Innovation through continuous learning',
    'Engineer · Creator · Storyteller',
    'I design the quiet infrastructure behind ambitious products: scalable distributed systems, real-time platforms, AI workflows, and interfaces that feel intentional — from first click to last deploy.',
    '[
      "I''m a Senior Software Engineer with 3+ years of experience who treats software like a product, not a task list. My recent work at <b>Vusic Technologies</b> and Turtleneck Systems has been deep in the trenches of <b>distributed systems</b> — designing platforms that hold up under 50K+ concurrent users, handle gigabyte-scale encrypted workloads, and stay responsive in milliseconds, not seconds.",
      "My playground is <b>system design</b>: choosing the right boundaries between services, picking the right consistency model, knowing when to reach for Kafka or RabbitMQ, when Redis is enough, and when the answer is simply a better data structure. I obsess over the tradeoffs most teams skip — and that''s usually where the real reliability lives.",
      "Beyond the code, I lead. I''ve owned features end-to-end, mentored engineers, translated fuzzy product asks into crisp technical roadmaps, shipped demos and walkthroughs for clients, and operated production systems with real observability. Ownership isn''t a buzzword for me — it''s the default mode.",
      "italic:The vision needs an architect."
    ]'::jsonb,
    'mvsinghsays@gmail.com',
    '+91 62838 49317',
    'https://linkedin.com/in/mvsingh02',
    'https://github.com/mvsingh07'
  )
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO v_profile_id;

  -- If profile already existed, get its id
  IF v_profile_id IS NULL THEN
    SELECT id INTO v_profile_id FROM profiles WHERE user_id = v_user_id;
  END IF;

  IF v_profile_id IS NULL THEN
    RAISE NOTICE 'Could not create or find profile — aborting seed.';
    RETURN;
  END IF;

  -- ── Services ───────────────────────────────────────────────────────────────
  INSERT INTO services (profile_id, icon_name, title, description, impact, accent, ord) VALUES
    (v_profile_id, 'Layers',   'Backend & System Architecture',  'End-to-end backend design from data modeling to NestJS service boundaries and deployment topology.',                                           'Foundations that survive 10× growth without a rewrite.',                 'from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]', 0),
    (v_profile_id, 'Boxes',    'Scalable Microservices',          'Right-sized services with clear contracts, Kafka/RabbitMQ messaging, BullMQ jobs, and observable interfaces.',                              'Independent teams shipping faster, with fewer outages.',                 'from-[hsl(var(--brand-violet))] to-[hsl(var(--brand-pink))]', 1),
    (v_profile_id, 'Gauge',    'Performance & Scaling',           'Profile, optimize, cache, and shard. From Redis-backed hot paths to query plans and infra cost engineering.',                               'Reduced critical latency from 500ms to 120ms in production systems.',    'from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-pink))]',   2),
    (v_profile_id, 'Radio',    'Real-time Systems',               'Event-driven backbones with Kafka, RabbitMQ, Redis, WebSockets, and resilient async processing.',                                           'Live experiences that hold under concurrent load.',                      'from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-cyan))]',   3),
    (v_profile_id, 'Sparkles', 'AI Integration',                  'Production-minded LLM, vector search, accessibility, and voice pipelines using LLaMA, OpenAI and ElevenLabs.',                             'Move AI from demo to dependable product feature.',                       'from-[hsl(var(--brand-violet))] to-[hsl(var(--brand-cyan))]', 4),
    (v_profile_id, 'Wand2',    'AI-Powered Frontend',             'Ship pixel-perfect, production-ready web experiences using Claude Code, Framer Motion, and modern UI toolchains.',                          'From idea to live site in days — not months.',                           'from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-violet))]', 5),
    (v_profile_id, 'Cpu',      'Tech Leadership',                 'Architecture reviews, PR reviews, client requirement analysis, demos, and roadmap shaping.',                                                'Lift the whole team''s engineering bar — not just the code.',            'from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]', 6)
  ON CONFLICT DO NOTHING;

  -- ── Projects ───────────────────────────────────────────────────────────────
  INSERT INTO projects (profile_id, number, title, tagline, problem, solution, impact, stack_tags, accent, ord) VALUES
    (v_profile_id, '01', 'Real-Time Auction Platform',
      'Live bidding for 50K+ concurrent users.',
      'Auctions where every millisecond matters — bids must be globally consistent, fair, and instantly reflected for every viewer.',
      'Event-driven core on Kafka and RabbitMQ with Redis-backed bid state, WebSocket fan-out, and idempotent write paths to guarantee correctness under bursty load.',
      'Supported 50K+ concurrent users while reducing end-to-end latency from 500ms to 120ms.',
      '["NestJS","Kafka","RabbitMQ","Redis","Next.js","Supabase","AWS S3"]'::jsonb,
      'from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]', 0),
    (v_profile_id, '02', 'File Processing Microservice',
      'Encrypted streaming for 1GB+ payloads.',
      'Single-shot uploads of large files were failing, blocking memory, and leaking sensitive data on retries.',
      'Chunked, resumable uploads with AES-256 and RSA encryption, BullMQ background jobs, parallel worker processing, RBAC, and signed URL delivery.',
      'Reliable processing of 1GB+ encrypted files with constant memory footprint and secure access controls.',
      '["NestJS","AES-256","RSA","BullMQ","AWS S3","RBAC","Postgres"]'::jsonb,
      'from-[hsl(var(--brand-violet))] to-[hsl(var(--brand-pink))]', 1),
    (v_profile_id, '03', 'AI Health Engine',
      'Voice-first AI for clinical workflows.',
      'Care teams needed instant, contextual answers from health data without typing or navigating dashboards.',
      'RAG pipeline blending LLaMA and OpenAI with Supabase vector search and ElevenLabs voice interaction behind a hardened API.',
      'Reduced query-to-insight time from minutes to seconds with conversational, multi-modal access.',
      '["Python","LLaMA","OpenAI","ElevenLabs","Supabase","FastAPI","Vector DB"]'::jsonb,
      'from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-cyan))]', 2)
  ON CONFLICT DO NOTHING;

  -- ── Career steps ───────────────────────────────────────────────────────────
  INSERT INTO career_steps (profile_id, chapter, year, role, org, body, ord) VALUES
    (v_profile_id, 'Chapter I',   '2020-2023',     'BCA, Computer Applications',  'Guru Nanak Dev University',        'Built the engineering foundation across programming, databases, and full-stack web development before moving into production software roles.', 0),
    (v_profile_id, 'Chapter II',  '2023-2025',     'Software Engineer',            'Turtleneck Systems & Solutions',   'Built JavaScript and Python web applications, secure REST APIs, dashboards, NiFi data pipelines, Docker/Kubernetes deployments, and ELK/OpenSearch monitoring.', 1),
    (v_profile_id, 'Chapter III', '2024-2026',     'MCA, AI & ML',                 'Chandigarh University',            'Continuing formal work in AI and ML while applying LLMs, vector databases, and voice AI systems in product-facing projects.', 2),
    (v_profile_id, 'Chapter IV',  '2025-Present',  'Senior Software Engineer',     'Vusic Technologies',               'Leading 2-3 engineers, owning architecture for real-time auction and secure file systems, deploying on AWS ECS/Kubernetes, and aligning delivery with client milestones.', 3)
  ON CONFLICT DO NOTHING;

  -- ── Skill groups ───────────────────────────────────────────────────────────
  INSERT INTO skill_groups (profile_id, cluster, title, items, ord) VALUES
    (v_profile_id, 'Foundation',     'Backend & Languages',   '["Node.js","TypeScript","NestJS","Express.js","Python","Django","Flask","FastAPI"]'::jsonb,                    0),
    (v_profile_id, 'Foundation',     'Data & Storage',        '["PostgreSQL","MongoDB","MySQL","Supabase","Redis","Vector DBs","Event Sourcing","CQRS"]'::jsonb,              1),
    (v_profile_id, 'Infrastructure', 'Distributed Systems',   '["Kafka","RabbitMQ","BullMQ","WebSockets","gRPC","Docker","Kubernetes","AWS ECS"]'::jsonb,                    2),
    (v_profile_id, 'Infrastructure', 'Observability & DevOps','["AWS S3","GitHub Actions","ELK","Prometheus","Grafana","OpenSearch","Nginx"]'::jsonb,                        3),
    (v_profile_id, 'Interface',      'Frontend',              '["React.js","Next.js","Angular","Framer Motion","Tailwind CSS","Highcharts"]'::jsonb,                         4),
    (v_profile_id, 'Interface',      'AI & Security',         '["OpenAI","LLaMA","ElevenLabs","AES-256","RSA","RBAC","OAuth","JWT"]'::jsonb,                                5)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seed complete for profile id=%', v_profile_id;
END $$;
