Final changes

- Default Page: Copy the hero section from src/app/home/page.tsx into default page: src/app/page.tsx

the updated hero section will have
1. Display Name
2. Three Motion texts will be Titles from hero slider section
3. Tagline

scroll indicator below

- Also Make sure the wall opening entrance animation effect renders only the first time in a web session, not on each reload

- Currenlty, the default page (src/app/page.tsx) is only showing the hero section, we need to make this page, single page replicating all the webpages that are added in navigation menu and configured to be part of ecosystem, striclty in the order they are added. I.e our default page will act as full fledge ecosytem, by automatically switching the tabs when we scroll

