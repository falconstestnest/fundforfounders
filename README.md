# FundForFounders

Pre-launch institutional landing page and stakeholder registration platform.

> Finding founders before the world sees their potential.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **Resend** for transactional email (user confirmation + internal notify)
- **Vercel** for deployment

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, stakeholders, podcast, roadmap, registration |
| `/thesis` | Investment thesis incl. **Digital-first capital** + official RBI Digital Rupee links |
| `/founders` | Founder pathway & FAQ |
| `/investors` | Investor / LP network |
| `/podcast` | Podcast landing |
| `/join` | Dynamic multi-stakeholder registration |
| `/contact` | Contact form |
| `/privacy`, `/terms` | Legal |
| `/thank-you`, `/application-received` | Success states |

## Digital Rupee (official)

On **Our Thesis → Digital-first capital** (`/thesis#digital-first`):

- [RBI Digital Rupee (e₹) FAQs](https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3686)
- [RBI CBDC Concept Note (PDF)](https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/CONCEPTNOTEACB531172E0B4DFC9A6E506C2C24FFB6.PDF)

Configured in `src/lib/config.ts` as `siteConfig.digitalRupee`.

## Local development

```bash
npm install
cp .env.example .env.local
# Add RESEND_API_KEY (optional for UI-only; required for real email)
npm run dev
```

## Environment variables

See `.env.example`.

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | For email | Resend API key |
| `RESEND_FROM_EMAIL` | Prod | Verified sender |
| `CONTACT_EMAIL` | Recommended | Public contact address |
| `INTERNAL_NOTIFY_EMAIL` | Recommended | Team inbox for leads |
| `NEXT_PUBLIC_SITE_URL` | Prod | Canonical site URL |
| `DATABASE_URL` | For DB | Neon Postgres connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase URL (alt to Neon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase service role |
| `ADMIN_SECRET` | For admin | Password for `/admin/leads` |

## Leads database

**Production uses Neon Postgres** (`DATABASE_URL`). Schema is in `supabase/migrations/001_leads.sql` (compatible with both Neon and Supabase; Neon uses `gen_random_uuid()`).

Registrations insert into `public.leads` with type-specific fields in `details` (jsonb). High-priority types (LP, FoF, VC, Government, International Investor) get `priority = High`.

### Admin

- Login: `/admin/login` (uses `ADMIN_SECRET`)
- Leads list + filters: `/admin/leads`
- CSV export: `/api/admin/export` (requires admin cookie)

Without a database, the form still accepts submissions and sends Resend emails when configured.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Set environment variables (at least `RESEND_API_KEY`, `INTERNAL_NOTIFY_EMAIL`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy.

Verify a domain in Resend before using a custom `RESEND_FROM_EMAIL`.

## Brand (Quiet Institutionalism)

- Ivory `#F7F5EF` · Forest `#123C31` · Gold `#B3935F` · Ink `#111311`
- Display: Cormorant Garamond · UI: Inter · Mono: IBM Plex Mono

## Legal posture (V1)

No fund offers, return promises, fake waitlist counts, or portfolio claims.
Footer and investor pages include the standard disclaimer.
