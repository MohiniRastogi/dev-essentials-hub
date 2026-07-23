## Developer Toolkit — v1 Plan

A dark, premium developer utilities site with a full shell (home, categories, search, favorites, recents) and 15 flagship tools fully implemented. Remaining tools appear in the UI marked "Coming soon" so the catalog is complete visually and we can ship the rest in follow-ups without churn.

### Scope decisions (I picked defaults since you skipped)
- **Dark theme only** in v1 (theme toggle deferred; keeps polish tight).
- **Lightweight editors** (styled textareas with monospace + line-numbered wrapper) instead of Monaco to keep bundle small and load fast. Can upgrade to Monaco later per-tool.
- **All client-side.** No backend, no auth.

### Flagship tools built end-to-end (15)
JSON Formatter, JSON Validator, JSON Minifier, JSON to CSV, Base64 Encode/Decode, URL Encode/Decode, JWT Decoder, UUID Generator, SHA-256 / MD5 (via SubtleCrypto + crypto-js), Password Generator, Word/Character Counter, Case Converter, Gradient Generator, QR Code Generator, Regex Tester, Color Picker (HEX/RGB/HSL).

All other tools from the spec appear as cards in their category with a "Coming soon" badge.

### Design system
- Palette from spec: bg `#09090B`, card `#18181B`, border `#27272A`, primary `#2563EB`, text `#FAFAFA`, muted `#A1A1AA`, success `#22C55E`, error `#EF4444`. Ported into `src/styles.css` as oklch tokens + shadcn semantic mapping.
- **Poppins** loaded via `<link>` in `__root.tsx` head.
- Glassmorphism cards, 20px radius, subtle blue glow shadows, Framer Motion fade/slide/scale on mount and hover.

### Routes (file-based, TanStack Router)
```
/                     home (hero, search, popular, recents, categories)
/tools                all tools grid + filters
/category/$slug       category page
/favorites            favorites list
/t/$toolSlug          tool page (dynamic, dispatches to tool component)
```
Each route sets its own `head()` (title, description, og). Sitemap + robots included.

### Global features
- Cmd/Ctrl+K command palette (shadcn `Command`) searching name/description/category.
- Favorites + recent tools in localStorage via a small `useLocalStorage` hook.
- Copy-to-clipboard + toast (sonner), download result, clear, drag-drop file upload on relevant tools.
- Responsive grid, keyboard nav, ARIA labels.

### Tech / dependencies to add
`framer-motion`, `qrcode`, `papaparse`, `crypto-js`, `uuid`, `js-beautify`. (shadcn, lucide, sonner already present.)

### File layout
```
src/
  routes/
    index.tsx
    tools.tsx
    category.$slug.tsx
    favorites.tsx
    t.$toolSlug.tsx
    sitemap[.]xml.ts
  components/
    layout/ (Navbar, Footer, ToolShell, Breadcrumb)
    home/ (Hero, PopularTools, CategoryGrid, RecentTools)
    common/ (ToolCard, CategoryCard, CopyButton, DownloadButton, CommandPalette)
  tools/
    registry.ts        (single source of truth: id, name, slug, category, icon, desc, component, status)
    json/, encoding/, security/, text/, design/, css/  (one file per implemented tool)
  hooks/ (useFavorites, useRecents, useLocalStorage, useHotkey)
  lib/ (hash.ts, jwt.ts, case.ts, download.ts)
public/
  robots.txt
```

### Tool page shell
Breadcrumb → Title + description → Input panel → Action buttons (Process/Copy/Download/Clear) → Output panel. Consistent across every tool via `<ToolShell>`.

### SEO
- Per-route `head()` with unique title/description/og.
- `sitemap.xml` server route enumerating home, category pages, and every tool slug from the registry.
- `robots.txt` allowing all.
- Semantic HTML, single H1 per page.

### Out of scope for v1 (flagged as follow-ups)
- Monaco editor
- Light theme toggle
- Remaining ~65 tools (visible as "Coming soon" cards)
- QR scanner (needs camera perms)
- Favicon generator (multi-format export)
