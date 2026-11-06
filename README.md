# TitleTrack (NPRJ740)
Next.js 14 + Supabase (PostgreSQL, Auth, Storage, RLS) + optional Claude AI. Deploy on Vercel.

## Setup
1. Install Node.js 18+, then `npm install`.
2. Supabase SQL Editor: run `supabase/schema.sql`, then `supabase/schema_v2.sql`.
3. Copy `.env.example` to `.env.local` and fill in the Supabase URL and key (AI key optional).
4. `npm run dev` then open http://localhost:3000
5. Sign up, then make yourself admin: run the commented `update ... set role='admin'` line at the bottom of `schema_v2.sql` with your email. Log out and in; an **Admin** link appears.
6. Automated tests: `npm test`
7. Deploy: push to GitHub, import on vercel.com, add the same env variables, tag a release.

## Features and requirement mapping
| Req | Feature | Where |
|---|---|---|
| FR01 | Sign up with SA ID validation, login | /signup, lib/idcheck.js |
| FR02 | Title deed guide + Deeds Office map | /deed, /map |
| FR03 | FLISP calculator (admin-editable limits) | /flisp, lib/flisp.js |
| FR04 | Step workflows with saved progress | /dashboard |
| FR05 | Private document vault (RLS + storage policy) | /dashboard |
| FR06 | Rights library from database | /rights |
| FR07 | Tribunal referral + PDF complaint | /tribunal |
| FR09 | Admin dashboard, roles, audit log | /admin |
| NFR | Installable PWA with offline pages; large-text and high-contrast buttons | public/sw.js, components/Boot.js |
| Extra | AI letter helper, deposit calc, lease checker, feedback | /letter /deposit /lease /feedback |

## Not included in this release (deferred)
SMS/email reminders (FR08) and isiZulu/Afrikaans/Sesotho translations.

## Security notes
RLS on every table; users cannot change their own role; storage folders are per user; the AI letter API requires a logged-in user; full ID numbers are never stored.
