# Navigation menu & i18n

The site header navigation is **sourced from the EmDash CMS**, localized per locale (EN/PT). This doc explains how it works and how to change the menu.

## TL;DR — how to edit the menu

Edit the menu in **EmDash CMS** (`https://cms.callemily.eu`), menu name **`primary`**. Changes appear on the live site within ~60s (cache TTL). Edit each locale separately — `en` and `pt` are independent translations sharing the same item URLs.

You do **not** edit menu labels in code anymore. The hardcoded list in `lib/translations.ts` is only a **fallback** used when the CMS is unreachable or a locale's menu is missing.

## Data flow

```
EmDash CMS  ──GET /_emdash/api/menus/primary?locale=<loc>──>  lib/menu.ts getMenu()
                                                                      │
                                                                      ▼
                                          components/header-server.tsx  (server component)
                                                                      │  navItems
                                                                      ▼
                                          components/header.tsx  (client component, renders <nav>)
                                                                      │
                                              navItems empty? ──yes──> FALLBACK_NAV (lib/translations.ts)
```

- **`lib/menu.ts`** — `getMenu(name, locale?)` fetches the menu from EmDash. Appends `?locale=<loc>` when a locale is given; caches for 60s (`revalidate: 60`) tagged `menu-<name>` and `menu-<name>-<locale>`. Returns `[]` on any error or when `EMDASH_URL` is unset.
- **`components/header-server.tsx`** — server component, takes `{ transparent?, locale? }`, calls `getMenu("primary", locale)` and passes the result to the client `Header`.
- **`components/header.tsx`** — client component. Renders `navItems` if non-empty, otherwise falls back to `FALLBACK_NAV` built from `t(locale).nav.items` in `lib/translations.ts`. Resolves each item's `url` to a locale-prefixed href (`/#problems` → `/en#problems`, `/price` → `/en/price`).

## Every header caller passes its locale

For PT pages to get the PT menu, each place that renders the header passes `locale`:

| File | Render |
|------|--------|
| `app/[locale]/page.tsx` (home) | `<Header locale={locale} />` |
| `app/[locale]/about/layout.tsx` | `<Header locale={locale} />` |
| `app/[locale]/blog/layout.tsx` | `<Header locale={locale} />` |
| `app/[locale]/privacy/page.tsx` | `<SiteHeader locale={locale} />` |
| `app/[locale]/roicalc/page.tsx` | `<Header transparent={false} locale={locale} />` |
| `app/not-found.tsx` | `<SiteHeader locale={locale} />` (locale from `x-locale` header, defaults `en`) |
| `app/[locale]/price/page.tsx` | fetches `getMenu("primary", locale)` itself and passes `navItems` to `PricePageClient` |

If you add a new page/layout that renders a header, **pass `locale`** or PT will silently show the English menu.

## Current menu contents

| sort | EN label | PT label | URL |
|------|----------|----------|-----|
| 0 | Problems | Problemas | `/#problems` |
| 1 | Features | Funcionalidades | `/#features` |
| 2 | How it works | Como funciona | `/#how` |
| 3 | Case Studies | Casos | `/#cases` |
| 4 | Pricing | Preços | `/price` |

## CMS admin API (for scripted edits)

The same `EMDASH_API_TOKEN` (admin-scoped) does reads and writes. Base: `https://cms.callemily.eu/_emdash/api/menus`. Key gotchas:

- Item body fields are **camelCase**: `customUrl` (not `custom_url`), `sortOrder`, `titleAttr`, `cssClasses`, `parentId`.
- **Create item:** `POST /menus/primary/items` `{type:"custom", label, customUrl, sortOrder}`.
- **Update item:** `PUT /menus/primary/items?id=<id>&locale=<loc>` — **PUT only** (PATCH 404s). `locale` is required once >1 locale exists, else `AMBIGUOUS_LOCALE`.
- **Delete item:** `DELETE /menus/primary/items?id=<id>`.
- **Create a locale translation:** `POST /menus` `{name:"primary", label, locale:"pt", translationOf:"<en-menu-id>"}` — auto-copies items from the source menu (with source labels; then PUT each to translate).
- `GET /menus/primary` with no `locale` defaults to `en`.

Menu `primary` translation_group / `en` id: `01KRBE0FEG4EMMBWWNFHEM0318`. PT menu id: `01KTBRXW6YP6SZKZZ1MFY503KY`.

## Adding a new locale

1. CMS: `POST /menus` with `translationOf` = the EN menu id and the new `locale`, then `PUT` each copied item to translate its label.
2. Code: no change needed — `getMenu` already forwards whatever locale the page passes. Ensure the locale is in `LOCALES` (`lib/i18n.ts`) and has a `nav` fallback in `lib/translations.ts`.
