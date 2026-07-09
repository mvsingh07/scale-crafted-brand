-- Seed the 6 service categories for mvsingh from docs/services.md.
-- Idempotent-ish: only inserts when the owner has no services yet.

insert into ecosystem_services (username, title, summary, items, impact, icon_name, accent, ord)
select * from (values
  (
    'mvsingh',
    'Digital Presence',
    'Build a professional online presence that represents your business with confidence.',
    array['Business Websites','Corporate Websites','Portfolio Websites','Landing Pages','Website Redesign','Responsive Development','Website Maintenance'],
    'Build trust, improve credibility, and create a professional first impression.',
    'Globe',
    '#C9A55A',
    0
  ),
  (
    'mvsingh',
    'Search Visibility',
    'Help customers discover your business through Google and AI-powered search platforms.',
    array['SEO — Search Engine Optimization','GEO — Generative Engine Optimization','Google Business Profile Optimization','Analytics & Performance Monitoring'],
    'Generate more organic traffic and increase qualified inquiries.',
    'Search',
    '#34D399',
    1
  ),
  (
    'mvsingh',
    'AI & Automation',
    'Use AI to reduce repetitive work and improve customer experience.',
    array['AI Chatbots','Business Workflow Automation','AI Content Assistance','Document Automation','Internal AI Tools'],
    'Save time, improve efficiency, and automate repetitive business processes.',
    'Bot',
    '#A78BFA',
    2
  ),
  (
    'mvsingh',
    'Custom Business Systems',
    'Lightweight custom systems that simplify daily operations without unnecessary complexity.',
    array['CMS — Content Management','CRM — Customer Relationships','Lead Management System','Client Dashboard','Admin Dashboard'],
    'Reduce manual work while improving business efficiency.',
    'LayoutDashboard',
    '#60A5FA',
    3
  ),
  (
    'mvsingh',
    'Digital Business Tools',
    'Connect your business with modern digital infrastructure.',
    array['Payment Gateway Integration','Accounting Solutions','Asset Management','Inventory Management','Transaction Management','Secure Authentication'],
    'Operate your business more efficiently with secure and scalable digital tools.',
    'CreditCard',
    '#F59E0B',
    4
  ),
  (
    'mvsingh',
    'Mobile Applications',
    'Build mobile experiences for customers and internal teams.',
    array['Android Applications','iOS Applications','Business Applications','Internal Team Applications'],
    'Take your business beyond the website and into your customers'' hands.',
    'Smartphone',
    '#F472B6',
    5
  )
) as seed(username, title, summary, items, impact, icon_name, accent, ord)
where not exists (
  select 1 from ecosystem_services where username = 'mvsingh'
);
