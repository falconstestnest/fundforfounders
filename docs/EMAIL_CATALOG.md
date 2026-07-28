# FundForFounders — Transactional email catalog

Design system matches the live site (Sequoia-inspired institutional):

| Token | Hex | Use |
|-------|-----|-----|
| Ivory | `#F3F3F2` | Outer background / footer |
| Paper | `#FFFFFF` | Email card |
| Ink | `#1B1916` | Headlines & body |
| Forest | `#00A071` | Accent bar, logo “For”, CTAs, eyebrows |
| Stone | `#928C86` | Secondary text |
| Border | `#E4E3E0` | Dividers |
| Warning | `#B06300` | Priority badge (internal only) |

**Layout:** 4px green top bar · wordmark Fund**For**Founders · tight sans headline · square CTA · disclaimer footer.

---

## Email inventory (13 templates)

### User-facing (registration)

| # | ID | Trigger | Subject (example) |
|---|-----|---------|-------------------|
| 1 | `user_registration_founder` | Founder, Startup Team Member | We received your founder application — FundForFounders |
| 2 | `user_registration_investor` | Angel Investor, HNI, International Investor | You're on the investor network list — FundForFounders |
| 3 | `user_registration_lp` | Limited Partner, Family Office | LP interest received — FundForFounders |
| 4 | `user_registration_vc` | Venture Capital Fund | Partnership interest received — FundForFounders |
| 5 | `user_registration_fof` | Fund of Funds | Institutional interest received — FundForFounders |
| 6 | `user_registration_government` | Government Agency, Public Institution | Institutional connection received — FundForFounders |
| 7 | `user_registration_ecosystem` | Incubator, Accelerator, University, Corporate Innovation, Mentor, Service Provider, Ecosystem Partner | Ecosystem partnership interest received — FundForFounders |
| 8 | `user_registration_media` | Media | You're on the media list — FundForFounders |
| 9 | `user_registration_generic` | Other | We received your registration — FundForFounders |

### User-facing (contact)

| # | ID | Trigger | Subject |
|---|-----|---------|---------|
| 10 | `user_contact_received` | Contact form submit | We received your message — FundForFounders |

### Internal (team)

| # | ID | Trigger | Subject |
|---|-----|---------|---------|
| 11 | `internal_registration` | Join form (standard types) | FFF registration: {Type} — {Name} |
| 12 | `internal_registration_priority` | Join form (LP, FoF, VC, Gov, International Investor) | [Priority] FFF registration: {Type} — {Name} |
| 13 | `internal_contact` | Contact form | FFF contact: {Name} |

**Priority stakeholder types:** Limited Partner, Family Office, Venture Capital Fund, Fund of Funds, Government Agency, International Investor.

---

## Implementation

| File | Role |
|------|------|
| `src/lib/emails/brand.ts` | Colour tokens |
| `src/lib/emails/layout.ts` | Shared HTML shell |
| `src/lib/emails/catalog.ts` | Catalog metadata |
| `src/lib/emails/templates.ts` | Per-template builders |
| `src/lib/email.ts` | Resend send helpers |
| `scripts/send-test-emails.mjs` | Bulk test send |

### Test send

```bash
node --env-file=.env.local scripts/send-test-emails.mjs jimmymanalelru@gmail.com
```

Subjects are prefixed with `[TEST]` for test runs.

### Production flow

- `POST /api/register` → user template (by stakeholder) + internal (priority-aware)
- `POST /api/contact` → user contact + internal contact

From: `RESEND_FROM_EMAIL` (e.g. `FundForFounders <hello@projects.jimmymanalel.com>`)  
Internal to: `INTERNAL_NOTIFY_EMAIL`
