# Codeholics Design System

> **Status:** Authoritative  
> **Scope:** All Codeholics pages, layouts, and UI components  
> **Stack:** Astro + Tailwind CSS  
> **Purpose:** Single source of truth for human and AI-assisted UI development

---

# 1. Visual Theme & Atmosphere

Codeholics is a technical publication built around curiosity, experimentation, systems engineering, open technology, and the culture of learning by building.

The interface should feel like a modern developer workstation translated into an editorial website: precise, technical, information-dense when appropriate, but never cluttered. Dark mode is the reference expression of the brand; light mode is a first-class equivalent with the same identity, not an afterthought. Terminal and Linux influences are welcome, but Codeholics must not look like a stereotypical "hacker" website.

The design should balance **developer-tool aesthetics with high-quality editorial design**. Articles may be long and technical, so readability always takes priority over decoration.

Codeholics should feel handcrafted by someone who actually works with Linux, automation, infrastructure, networking, security, development, and AI—not like a generic technology SaaS template.

### Brand Personality

- Technical
- Curious
- Independent
- Practical
- Precise
- Slightly rebellious
- Developer-focused
- Modern without chasing trends

### Key Characteristics

- Dark-first design with a first-class light theme
- Follows the visitor's OS color-scheme preference by default
- Strong typographic hierarchy
- Terminal-inspired details used selectively
- Thin borders instead of excessive shadows
- Restrained violet/lavender accents over cool slate neutrals
- High information clarity
- Strong code and technical-content presentation
- Restrained animation
- Generous article whitespace
- Dense interfaces only where density provides value
- Linux/developer culture without hacker clichés

### Design Philosophy

**Content first. Interface second. Decoration third.**

Every visual element must serve at least one of these purposes:

1. Improve hierarchy.
2. Improve comprehension.
3. Improve navigation.
4. Communicate interactivity.
5. Reinforce the Codeholics identity.

If an element does none of these things, remove it.

---

# 2. Color Palette & Roles

Codeholics uses the existing [live site](https://codeholics.com/) palette: cool slate neutrals with violet accents in light mode and lavender accents in dark mode.

**Color baseline verified on 2026-10-27:** the live homepage was inspected in both themes using computed styles and screenshots. Its shared theme values match `astro/src/styles/global.css`. The tables below retain the actual CSS variable names and source RGBA notation; deployed CSS may serialize the same values as eight-digit hex.

This section documents the approved current appearance, not a proposed redesign. Preserve its colors, transparency, gradients, and theme-specific contrast relationships. A future palette redesign requires a separate, explicit decision.

Reuse the existing theme variables and `theme-*` helpers. A migration to new `--color-*` names or a different Tailwind token scheme is not required. Other sections remain design guidance; this color capture is not evidence that every typography, spacing, or interaction rule already matches production.

## Theme Modes

| Mode | Behavior |
|---|---|
| **System** (default) | Follows the visitor's `prefers-color-scheme`. Updates live if the OS preference changes. |
| **Light** | Forces the light theme. |
| **Dark** | Forces the dark theme. |

Rules:

1. **Default is System.** A first-time visitor sees the theme their OS requests.
2. **Dark is the reference theme.** Design and review new UI in dark first, then verify it in light. When a visitor has no OS preference, the site follows the browser default for `prefers-color-scheme`.
3. **Both themes are first-class.** Every page and component must meet the same hierarchy, readability, and WCAG AA contrast requirements in both themes. "Looks fine in dark" is not done.
4. **The visitor's explicit choice persists** across pages and visits (`localStorage`). Choosing System restores OS-based resolution; the existing implementation stores this mode as `auto`.
5. **No flash of the wrong theme.** The resolved theme must be applied before first paint by a small blocking inline script in `<head>`. This is the one justified exception to zero-JS-by-default for theming.
6. **The theme is applied in one place:** a `dark` class on `<html>`, with `color-scheme: dark` or `color-scheme: light` set to match so native controls and scrollbars follow.
7. **Without JavaScript the site must remain fully readable.** Falling back to the light theme is acceptable; following `prefers-color-scheme` through CSS is preferred where practical.
8. **Theme switching is instant.** Do not cross-fade or animate the whole page between themes.
9. Provide a `<meta name="theme-color">` for each scheme (`media="(prefers-color-scheme: dark)"` / `light`) using the Page Background token.

### Theme Toggle

- Lives in the primary navigation on every page, on both desktop and mobile.
- Is a native `<button>`. Its accessible name states the current mode and the action (for example "Theme: System. Switch to light").
- Cycles **System → Light → Dark → System**, or presents those three options explicitly.
- Uses distinct icons per mode and does not rely on the icon alone to communicate state.
- Meets the 44px touch target and has a visible focus ring in both themes.

## Accents and Primary Actions

| Role | Existing variable / rule | Dark | Light |
|---|---|---|---|
| Link / accent | `--accent` | `#A78BFA` | `#7C3AED` |
| Link / accent hover | `--accent-hover` | `#C4B5FD` | `#6D28D9` |
| Primary action background | `.theme-primary-action`, `--page-heading` | `#F8FAFC` | `#020617` |
| Primary action text | `.theme-primary-action`, `--bg` | `#0B1220` | `#F8FAFC` |
| Primary action hover background | `--accent` | `#A78BFA` | `#7C3AED` |
| Primary action hover text | `.theme-primary-action:hover` | `#FFFFFF` | `#FFFFFF` |

Primary actions are neutral, high-contrast buttons at rest, not blue-filled buttons. Ordinary accent links use violet/lavender; headings remain neutral until their hover treatment applies.

The Tailwind configuration also contains legacy `primary: #60A5FA` and `bg: #0F1720` entries. These are not replacements for the rendered page background or the `--accent` link colors. Preserve established uses rather than applying those configuration values globally.

## Gradients

| Role | Existing variable / rule | Dark | Light |
|---|---|---|---|
| Page background | `body` | `linear-gradient(180deg, #0B1220, #071021)` | `linear-gradient(180deg, #F8FAFC, #E2E8F0)` |
| Home hero | `--hero-bg` | `linear-gradient(90deg, rgba(124,58,237,0.14), rgba(124,58,237,0.08), transparent)` | Same |
| Header | `.theme-appbar` | `linear-gradient(to bottom, var(--header-bg), var(--header-bg-gradient-end))` | Same rule, light header values |

These existing restrained gradients are part of the approved appearance. They are not violations of the guidance against gratuitous gradients. Do not remove them or substitute cyan gradients as part of a review.

## Neutral Scale

The raw neutral scale (Tailwind `slate`) is shared by both themes. Existing theme variables select from this scale and the custom background shades below.

| Step | Hex |
|---|---|
| 50 | `#F8FAFC` |
| 100 | `#F1F5F9` |
| 200 | `#E2E8F0` |
| 300 | `#CBD5E1` |
| 400 | `#94A3B8` |
| 500 | `#64748B` |
| 600 | `#475569` |
| 700 | `#334155` |
| 800 | `#1E293B` |
| 900 | `#0F172A` |
| 950 | `#020617` |

## Text Colors

| Role | Token | Dark | Light | Usage |
|---|---|---|---|---|
| Heading | `--page-heading` | `#F8FAFC` | `#020617` | Page titles, section headings, heading links |
| Body | `--page-text` | `#E2E8F0` | `#1E293B` | Primary body text |
| Secondary | `--muted` | `#CBD5E1` | `#475569` | Supporting copy |
| Metadata | `--muted-soft` | `#94A3B8` | `#64748B` | Dates, compact metadata |
| Code | `--code-text` | `#CBD5E1` | `#312E81` | Code text fallback |

In light mode, `--muted-soft` meets 4.5:1 only near the top of the page gradient. For small text on transparent surfaces lower on the page, such as repository card metadata and Projects section eyebrows, use `--muted` instead.

## Surface Colors

| Role | Token | Dark | Light | Usage |
|---|---|---|---|---|
| Page Background | `--bg` | `#0B1220` | `#F8FAFC` | Base fill and top of page gradient |
| Page Gradient End | `--bg-accent` | `#071021` | `#E2E8F0` | Bottom of page gradient |
| Surface | `--surface-bg` | `rgba(15,23,42,0.9)` | `rgba(255,255,255,0.82)` | Cards, reading surfaces, panels |
| Code Background | `--code-bg` | `rgba(2,6,23,0.94)` | `rgba(15,23,42,0.04)` | Code surfaces |
| Chip Background | `--chip-bg` | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.9)` | Tag chips |
| Chip Hover | `--chip-hover-bg` | `rgba(255,255,255,0.14)` | `rgba(226,232,240,0.92)` | Hovered chips |

Alpha values are intentional: the visible result depends on the background underneath. Do not replace translucent fills with opaque approximations. Repository cards are transparent at rest; on hover they use `color-mix(in srgb, var(--page-heading) 5%, transparent)` and an accent border.

## Borders

| Role | Token | Dark | Light | Usage |
|---|---|---|---|---|
| Shared surface border | `--surface-border` | `rgba(148,163,184,0.18)` | `rgba(148,163,184,0.28)` | Cards, dividers, search |
| Header border | `--header-border` | `rgba(255,255,255,0.08)` | `rgba(148,163,184,0.24)` | App bar bottom border |
| Header search border | `--header-search-border` | `rgba(255,255,255,0.12)` | `rgba(148,163,184,0.36)` | Header search controls |
| Repository hover border | `--accent` | `#A78BFA` | `#7C3AED` | Repository card hover |

## Navigation Colors

| Role / existing variable | Dark | Light |
|---|---|---|
| `--header-bg` | `rgba(15,23,42,0.68)` | `rgba(255,255,255,0.78)` |
| `--header-bg-gradient-end` | `rgba(15,23,42,0.16)` | `rgba(255,255,255,0.18)` |
| `--header-brand` | `#F8FAFC` | `#0F172A` |
| `--header-link` | `#E2E8F0` | `#1E293B` |
| `--header-icon` | `#E2E8F0` | `#334155` |
| `--header-hover-text` | `#FFFFFF` | `#020617` |
| `--header-hover-bg` | `rgba(255,255,255,0.08)` | `rgba(15,23,42,0.06)` |
| `--header-focus-ring` | `rgba(255,255,255,0.12)` | `rgba(124,58,237,0.22)` |
| `--header-search-bg` | `rgba(15,23,42,0.98)` | `rgba(255,255,255,0.96)` |
| `--header-search-text` | `#F8FAFC` | `#0F172A` |
| `--header-search-placeholder` | `#CBD5E1` | `#64748B` |
| `--header-mobile-panel-bg` | `rgba(15,23,42,0.92)` | `rgba(255,255,255,0.96)` |

The app bar combines this gradient with `backdrop-filter: blur(12px)`. Preserve that existing localized translucency; it does not authorize glass effects across unrelated UI.

## Alerts and Focus

| Role | Token | Dark | Light | Usage |
|---|---|---|---|---|
| Note | `--alert-note` | `#60A5FA` | `#2563EB` | Note alerts |
| Tip | `--alert-tip` | `#4ADE80` | `#15803D` | Tip alerts |
| Important | `--alert-important` | `#C084FC` | `#7E22CE` | Important alerts |
| Warning | `--alert-warning` | `#FBBF24` | `#B45309` | Warning alerts |
| Caution | `--alert-caution` | `#F87171` | `#B91C1C` | Caution alerts |

Existing global keyboard focus is a 3px outline in `rgba(124,58,237,0.2)` with a 2px offset. `.focus-ring` uses a 3px shadow in `rgba(124,58,237,0.18)`. Header-specific focus uses `--header-focus-ring`; repository links use `--accent`. These describe the current implementation, not a claim that every indicator already passes contrast checks.

## Contrast Requirements

Both themes must meet WCAG 2.2 AA:

| Pairing | Minimum |
|---|---:|
| Body text, metadata, links, button labels | 4.5:1 |
| Large text (≥ 24px, or ≥ 18.66px bold) | 3:1 |
| Focus indicators, control boundaries, meaningful icons | 3:1 |

The palette tables are an accurate baseline, not an accessibility certification. Measure contrast against the actual composited backgrounds, including gradients, translucent surfaces, and hover/focus states. Record any failure as a specific review finding; do not silently replace the approved palette with a new one to make the documentation claim compliance.

Do not introduce a new color pairing without checking it in both themes. Any needed accessibility correction should be proposed as a focused follow-up, not a site-wide recoloring.

## Color Usage Rule

The majority of any page should consist of the page gradient, shared surfaces, neutral body text, and supporting text.

- Dark: `#0B1220` to `#071021`, translucent slate surfaces, `#E2E8F0`, `#CBD5E1`, `#94A3B8`.
- Light: `#F8FAFC` to `#E2E8F0`, translucent white surfaces, `#1E293B`, `#475569`, `#64748B`.

Accent colors should generally occupy **less than 10% of the visible interface** in either theme.

Never create rainbow interfaces simply because technical content contains multiple categories.

---

# 3. Typography Rules

Typography must prioritize technical readability and editorial longevity.

## Font Families

**Primary / UI Font:** `IBM Plex Sans`, sans-serif  
**Editorial Font:** `IBM Plex Sans`, sans-serif  
**Monospace Font:** `JetBrains Mono`, monospace

IBM Plex Sans provides the technical character Codeholics needs without making every piece of content feel like source code.

JetBrains Mono is reserved for code, terminal UI, technical labels, command output, and intentionally developer-oriented details.

Do not use monospace for normal paragraphs.

## Type Scale

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---:|---:|---:|---:|---|
| Display Hero | IBM Plex Sans | 56px | 700 | 1.05 | -0.035em | Major landing-page hero |
| Display Large | IBM Plex Sans | 44px | 700 | 1.10 | -0.025em | Page title |
| Article Title | IBM Plex Sans | 42px | 700 | 1.12 | -0.025em | Article pages |
| Section Heading | IBM Plex Sans | 32px | 650 | 1.20 | -0.015em | H2 |
| Sub-heading | IBM Plex Sans | 24px | 600 | 1.30 | -0.01em | H3 |
| Minor Heading | IBM Plex Sans | 20px | 600 | 1.35 | 0 | H4 |
| Body Large | IBM Plex Sans | 18px | 400 | 1.70 | 0 | Intro/lead |
| Body | IBM Plex Sans | 16px | 400 | 1.70 | 0 | General UI/body |
| Article Body | IBM Plex Sans | 18px | 400 | 1.75 | 0 | Long-form content |
| Button | IBM Plex Sans | 14px | 600 | 1.00 | 0.01em | Controls |
| Small | IBM Plex Sans | 14px | 400 | 1.50 | 0 | Metadata |
| Caption | IBM Plex Sans | 12px | 500 | 1.40 | 0.02em | Supporting text |
| Technical Label | JetBrains Mono | 12px | 500 | 1.40 | 0.04em | Tags/status/terminal UI |
| Code | JetBrains Mono | 14px | 400 | 1.65 | 0 | Code blocks |

## Article Width

Long-form text must not span the full site container.

Preferred prose width:

```text
65ch - 75ch
```

Default target:

```text
70ch
```

Wide elements such as diagrams, images, tables, code blocks, and interactive demos may break outside the prose column when useful.

---

# 4. Component Styling

## Buttons

### Primary Button

| Property | Value |
|---|---|
| Background | `var(--page-heading)` |
| Text | `var(--bg)` |
| Font | IBM Plex Sans, 14px, 600 |
| Padding | `10px 16px` |
| Minimum Height | `44px` |
| Radius | `8px` |
| Border | No additional accent border on `.theme-primary-action` |
| Shadow | `var(--surface-shadow)` |
| Hover | Background `var(--accent)`, text `#FFFFFF` |
| Focus Ring | Existing global focus treatment; see §2 Alerts and Focus |
| Active Transform | `translateY(1px)` |
| Disabled Opacity | `0.50` |
| Transition | `150ms ease` |

### Secondary Button

| Property | Value |
|---|---|
| Background | `rgba(255,255,255,0.12)` (home secondary action) |
| Text | `var(--page-heading)` |
| Border | `1px solid var(--surface-border)` |
| Hover Background | `rgba(255,255,255,0.28)` |
| Hover Border | Unchanged |
| Radius | `8px` |
| Padding | `10px 16px` |
| Minimum Height | `44px` |

Avoid excessive pill-shaped buttons.

Use pills only for filters, tags, statuses, and compact controls.

---

## Cards

Cards should feel like structured content regions rather than floating dashboard widgets.

| Property | Value |
|---|---|
| Background | `var(--surface-bg)` |
| Border | `1px solid var(--surface-border)` |
| Radius | `12px` |
| Padding | `24px` |
| Shadow | `var(--surface-shadow)` on `.theme-surface`; home panels have no added shadow |
| Hover Border | Follow the existing component; repository cards use `var(--accent)` |
| Hover Background | Follow the existing component; repository cards use the 5% heading-color mix in §2 |
| Transition | `150ms ease` |

Interactive cards may move upward a maximum of:

```css
transform: translateY(-2px);
```

Avoid dramatic card lift effects.

### Featured Cards

Featured content may use:

- subtle accent border
- faint radial glow
- larger image
- larger title
- increased internal spacing

Do not add glow or recolor every featured card to create emphasis.

---

## GitHub Repository Cards

Repository cards are a first-class Codeholics component.

They should visually resemble developer tooling without copying GitHub's interface.

Include when available:

- repository name
- concise description
- primary language
- stars
- forks
- license
- updated date
- repository link
- optional topic tags

Repository name should receive the strongest hierarchy.

Stats should be visually secondary.

Use icons sparingly.

Repository cards should remain readable even when GitHub metadata is unavailable.

---

## Tags

Tags use technical-label typography.

```text
Font: JetBrains Mono
Size: 12px
Weight: 500
Radius: 6px
```

Default:

```text
Background: var(--chip-bg)
Text: var(--page-heading)
Border: no additional border on .theme-home-chip
```

Hover:

```text
Background: var(--chip-hover-bg)
Text: var(--page-heading)
```

Avoid large collections of brightly colored tags.

---

## Inputs

| Property | Value |
|---|---|
| Background | `var(--surface-bg)` for page search; `var(--header-search-bg)` in the header |
| Border | `1px solid var(--surface-border)` for page search; `var(--header-search-border)` in the header |
| Text | `var(--page-text)` for page search; `var(--header-search-text)` in the header |
| Placeholder | `var(--muted-soft)` for page search; `var(--header-search-placeholder)` in the header |
| Radius | `8px` |
| Padding | `10px 12px` |
| Minimum Height | `44px` |
| Focus | Existing global/header focus treatment; see §2 Alerts and Focus |

No separate error-border or disabled-fill token is currently defined. Do not invent those colors during this documentation capture.

---

## Navigation

Navigation should feel closer to a developer tool than a corporate marketing site.

Desktop navigation:

- compact
- horizontally aligned
- clearly indicates active location
- avoids oversized navigation bars

Terminal-inspired labels such as `~/` may be used where already part of the Codeholics identity.

Active navigation should use color and/or a restrained indicator rather than a large pill background.

Recommended height:

```text
64px
```

---

## Code Blocks

Code is a primary content type, not an afterthought.

```text
Background: var(--code-bg)
Text fallback: var(--code-text)
Border: var(--surface-border) where the existing code container has a border
Radius: 10px
Font: JetBrains Mono
Font Size: 14px
Line Height: 1.65
```

Code blocks follow the active theme. Syntax highlighting uses a paired dark/light theme (for example Shiki dual themes), so token colors are designed for each background rather than reused across both. Every token color must stay readable (4.5:1 target) on its theme's code background.

Preserve the existing inline-code styles from `global.css`; use the active theme's code colors rather than introducing a new blue/cyan code palette.

Code blocks should support:

- syntax highlighting
- horizontal scrolling
- optional language label
- optional filename
- copy button
- visible keyboard focus
- accessible contrast

Never fake terminal chrome with macOS red/yellow/green window controls.

When terminal chrome is used, prefer neutral/Linux-inspired window decoration.

---

## Callouts

Preserve the existing GitHub Markdown alert types:

```text
NOTE
TIP
IMPORTANT
WARNING
CAUTION
```

Callouts use:

- a restrained tinted background using the existing alert styles
- colored left border using the matching `--alert-note`, `--alert-tip`, `--alert-important`, `--alert-warning`, or `--alert-caution` variable
- semantic icon
- heading
- content

Do not flood the entire callout with bright color.

---

# 5. Layout Principles

## Base Unit

```text
4px
```

## Spacing Scale

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
128px
```

Avoid arbitrary values unless required by a specific layout.

## Main Container

```text
max-width: 1280px
```

Recommended horizontal padding:

```text
Mobile: 16px
Tablet: 24px
Desktop: 32px
Large: 40px
```

## Article Container

```text
Prose: 70ch
Wide content: up to 1100px
```

## Grid

| Property | Value |
|---|---|
| Desktop Columns | 12 |
| Tablet Columns | 8 |
| Mobile Columns | 4 |
| Desktop Gap | 24px |
| Tablet Gap | 20px |
| Mobile Gap | 16px |

## Section Spacing

| Context | Value |
|---|---:|
| Major page sections | 96px |
| Section groups | 64px |
| Subsections | 40px |
| Component groups | 24px |
| Related elements | 12-16px |

## Border Radius Scale

| Size | Value | Usage |
|---|---:|---|
| XS | 4px | tiny labels |
| Small | 6px | tags |
| Medium | 8px | buttons, inputs |
| Large | 12px | cards |
| XL | 16px | major feature surfaces |
| Full | 9999px | avatars/status indicators only |

Avoid using `rounded-2xl` or `rounded-3xl` automatically.

Radius communicates component type.

---

# 6. Depth & Elevation

Codeholics should rely more on **borders, contrast, and layering** than heavy shadows.

| Existing role / variable | Dark | Light |
|---|---|---|
| Surface shadow, `--surface-shadow` | `0 18px 40px rgba(2,6,23,0.35)` | `0 18px 40px rgba(148,163,184,0.18)` |
| Header elevation, `--header-elev` | `0 6px 18px rgba(2,6,23,0.6)` | Same |
| Flat panels / repository cards | No added shadow | No added shadow |

These are the existing shadow colors and opacities, not a new numbered elevation system. Reuse them where the current components do; do not add `--shadow-1` through `--shadow-4` or retune shadow colors as part of this capture.

## Glow

A new glow treatment is not part of this palette baseline. Preserve the existing subtle violet hero gradient and surface shadows; do not introduce sky/cyan glow or apply glow to every card.

---

# 7. Do's and Don'ts

## Do

1. Prioritize article readability over decorative UI.
2. Use `--accent` (`#A78BFA` dark / `#7C3AED` light) strategically for meaningful emphasis.
3. Use borders and surface changes before adding shadows.
4. Use JetBrains Mono for genuinely technical UI.
5. Let code, diagrams, screenshots, and technical imagery become visual focal points.
6. Maintain strong hierarchy between page title, section heading, metadata, and body.
7. Prefer purposeful asymmetry over automatically centered layouts.
8. Give important content room to breathe.
9. Make interactive elements visibly interactive.
10. Design components to work with real content of unpredictable length.
11. Preserve a recognizable Codeholics identity across every page.
12. Treat accessibility and keyboard interaction as part of visual design.

## Don't

1. Do not create generic SaaS landing-page layouts.
2. Do not use purple-to-blue AI gradients as the default visual treatment.
3. Do not use glassmorphism across the site.
4. Do not make every component a rounded floating card.
5. Do not put every section inside a container.
6. Do not use giant decorative gradients behind ordinary headings.
7. Do not create symmetrical three-card layouts merely because three items exist.
8. Do not use emojis as primary interface icons.
9. Do not overuse monospace typography.
10. Do not use fake macOS terminal controls.
11. Do not add animation simply because Tailwind makes it easy.
12. Do not sacrifice readability for "cyberpunk" aesthetics.
13. Do not introduce React, Vue, Svelte, or another client framework solely to implement visual styling.
14. Do not create one-off component styling when an established Codeholics component already solves the problem.
15. Do not invent new brand colors without updating this document.
16. Prefer the existing theme variables and helpers for new shared colors rather than duplicating hex values.
17. Existing raw palette utilities and dark-mode compatibility overrides are not automatic palette defects. Any cleanup must preserve the rendered colors in both themes.
18. Do not invert or filter photos or technical imagery to fit a theme.

## The AI Slop Test

Before accepting an AI-generated interface, ask:

> **If someone were told this page was generated by AI, what elements would make them immediately believe it?**

Look specifically for:

- giant centered headline + gradient
- excessive glowing borders
- random gradient text
- excessive rounded cards
- three identical feature cards
- unnecessary glass effects
- floating decorative blobs
- meaningless metric cards
- generic icons
- unnecessary pills
- identical spacing everywhere
- excessive centered text
- gratuitous animations
- every section looking like a component library demo

If those patterns appear without a clear reason, redesign the interface.

The goal is not to avoid modern design.

The goal is to avoid **predictable design**.

---

# 8. Responsive Behavior

Codeholics is mobile-first.

## Breakpoints

Follow Tailwind breakpoints unless the project explicitly overrides them.

| Name | Width | Columns | Container Padding |
|---|---:|---:|---:|
| Mobile | `<640px` | 4 | 16px |
| SM | `640px` | 4 | 20px |
| MD | `768px` | 8 | 24px |
| LG | `1024px` | 12 | 32px |
| XL | `1280px` | 12 | 40px |
| 2XL | `1536px` | 12 | 40px |

## Touch Targets

Minimum interactive target:

```text
44px × 44px
```

Minimum spacing between independent touch targets:

```text
8px
```

## Typography Scaling

| Role | Mobile | Tablet | Desktop |
|---|---:|---:|---:|
| Display Hero | 36px | 46px | 56px |
| Display Large | 32px | 38px | 44px |
| Article Title | 32px | 36px | 42px |
| Section Heading | 26px | 29px | 32px |
| Sub-heading | 21px | 22px | 24px |
| Article Body | 17px | 18px | 18px |
| Body | 16px | 16px | 16px |

Prefer CSS `clamp()` where it reduces breakpoint complexity.

## Grid Behavior

### Mobile

Default to one column.

Do not force desktop information density onto narrow screens.

### Tablet

Introduce two-column layouts when content benefits from comparison or scanning.

### Desktop

Use multi-column layouts only when the content relationship warrants them.

Do not automatically turn every card collection into three columns.

## Navigation

Desktop (from `1024px`):

```text
Compact horizontal navigation
```

Below `1024px`:

```text
Compact menu / drawer
```

- All inline links share one label size; the `# Codeholics` brand never wraps.
- The app-bar shows the social icon group only from `1280px`, where it fits.
- The footer shows a dedicated social icon group at every width, visually separate from the copyright line. It reuses the app-bar icon-button treatment with a `--surface-border` outline, an `8px` radius, and `44px` targets.
- The header must never cause horizontal page scrolling. Adding or renaming a navigation item requires re-running the boundary overflow tests in `astro/tests/navbar.spec.ts`.

Navigation must remain usable without JavaScript whenever practical.

## Images

Article imagery:

```text
Mobile: may extend toward viewport edges when appropriate
Desktop: constrained relative to article width
```

Never distort imagery to satisfy a fixed card height unless the component explicitly uses cropped thumbnails.

## Tables

Technical tables must remain usable on mobile.

Preferred strategy:

```text
overflow-x-auto
```

Do not shrink table text until it becomes unreadable.

## Code Blocks

Code blocks should horizontally scroll rather than wrap commands or source code unpredictably.

---

# 9. Astro + Tailwind Implementation Rules

This section is normative.

Visual consistency is not sufficient if implementation violates the architecture of the site.

## Astro First

Use `.astro` components by default.

A component that only renders HTML/CSS must remain an Astro component.

Do not introduce:

```text
React
Vue
Svelte
Solid
```

for static presentation.

## Zero JavaScript by Default

Every component starts with a JavaScript budget of:

```text
0 KB client-side JavaScript
```

Add client-side JavaScript only when actual interaction requires it.

Before using a `client:*` directive, determine whether the behavior can be achieved with:

1. HTML
2. CSS
3. native browser behavior
4. a small vanilla script
5. a Web Component

Only hydrate framework components when justified.

## Component Boundaries

Create a component when one or more are true:

- the pattern appears multiple times
- the component has meaningful internal structure
- the component represents a recognizable design-system primitive
- the component has its own behavior
- extracting it substantially improves readability

Do not componentize trivial markup purely to increase component count.

## Component API

Component props must describe **meaning**, not arbitrary presentation.

Prefer:

```astro
<RepoCard
  repo={repo}
  featured={true}
/>
```

Avoid:

```astro
<RepoCard
  padding="24px"
  radius="12px"
  titleColor="#38BDF8"
  borderColor="#334155"
/>
```

Design tokens belong to the design system.

They should not leak through every component API.

## Variants

When legitimate variants exist, use semantic variants.

Example:

```ts
type Variant = "default" | "featured" | "compact";
```

Avoid large collections of boolean styling props.

## Tailwind

Prefer existing Tailwind utilities and project tokens.

Do not create arbitrary values when an established token exists.

Prefer:

```text
gap-6
p-6
rounded-xl
```

over:

```text
gap-[23px]
p-[25px]
rounded-[13px]
```

unless exact layout requirements justify the arbitrary value.

## Theming Implementation

- Reuse the current variables from §2 in global CSS: light values on `:root` and dark values on `html.dark`.
- Reuse the existing `theme-*` helper classes and component styles. Do not require a Tailwind `@theme` migration to preserve this design.
- Keep the class-based theme resolution so the visitor's explicit choice wins over OS preference.
- Preserve the existing dark-mode compatibility rules while they are needed. Refactoring them is separate work, not a reason to change the palette.
- Prose uses the existing theme variables and configured syntax colors. Verify the resulting appearance in both themes.
- Third-party embeds and diagrams (Mermaid, YouTube, syntax themes) must be configured for both themes or placed on a neutral surface that works in both.

## Repeated Utility Groups

When the same conceptual component repeatedly uses the same long utility collection, consider extracting:

- an Astro component
- a reusable variant helper
- a CSS component class
- a design token

Do not blindly use `@apply` everywhere.

## CSS

Use component-scoped Astro styles for unique component behavior.

Use global CSS for:

- design tokens
- typography foundations
- prose styles
- normalization
- globally shared primitives

Avoid large page-specific global stylesheets.

## Images

Use Astro image tooling for local content imagery whenever appropriate.

Always provide:

- meaningful `alt`
- dimensions/aspect information where possible
- responsive sizing

Decorative images use empty alt text.

Images must work on both theme backgrounds. Transparent PNG/SVG artwork (logos, diagrams, icons) must stay legible on light and dark surfaces. Provide a per-theme variant or place it on a neutral surface; never invert it with CSS filters.

## Icons

Prefer a consistent icon library or project SVG components.

Icons should inherit `currentColor` whenever possible.

Do not mix several unrelated icon styles.

## Accessibility

All generated components must include accessibility as part of implementation—not as a later cleanup step.

Requirements include:

- semantic HTML
- keyboard accessibility
- visible focus state
- sufficient contrast
- meaningful link text
- form labels
- appropriate ARIA only where native semantics are insufficient
- reduced-motion support

Never add ARIA to compensate for incorrect HTML when semantic HTML can solve the problem.

---

# 10. Motion & Interaction

Motion should communicate state, hierarchy, or spatial relationship.

## Standard Durations

```text
Fast:     100ms
Default:  150ms
Moderate: 200ms
Slow:     300ms
```

Most UI interactions should use:

```text
150ms
```

## Allowed Motion

- subtle color transitions
- border transitions
- small card elevation
- menu reveal
- accordion expansion
- search result transitions
- small icon transformations

## Avoid

- constant ambient movement
- bouncing buttons
- large parallax effects
- dramatic page transitions
- animation on every scroll event
- cursor-following decorations
- excessive spring animation

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Motion must never be required to understand content.

Switching themes is instant. Do not animate background or color transitions across the whole page when the theme changes.

---

# 11. Content & Editorial UI

Codeholics is primarily a content site.

Article design therefore takes priority over marketing-page conventions.

## Article Header

Preferred hierarchy:

```text
Category / metadata
↓
Article title
↓
Description / dek
↓
Date • reading time • optional author
↓
Hero image
↓
Article
```

Avoid surrounding the article header with a card.

The content itself should establish hierarchy.

## Article Content

Support excellent rendering for:

- headings
- paragraphs
- links
- lists
- nested lists
- blockquotes
- code
- terminal commands
- tables
- images
- captions
- diagrams
- callouts

## Heading Spacing

Headings need more space above than below.

Example:

```text
H2 top: 56px
H2 bottom: 20px

H3 top: 40px
H3 bottom: 16px
```

This visually associates the heading with the content that follows it.

## Links

Article links must be identifiable without relying solely on color.

Use either:

- underline
- underline on hover with another persistent affordance
- another accessible visual treatment

## Metadata

Metadata is supporting information.

Use:

```text
var(--muted-soft)  (#94A3B8 dark / #64748B light)
14px
```

Do not allow metadata to compete with article titles.

---

# 12. Technical Imagery

Codeholics imagery should feel intentional and related to the subject.

Preferred visual directions include:

- terminal interfaces
- hardware
- network diagrams
- architecture diagrams
- abstract technical systems
- code
- Linux-inspired environments
- infrastructure
- developer workspaces
- cyberpunk influence when appropriate

Avoid generic stock imagery such as:

- anonymous person typing at laptop
- floating holographic padlocks
- hooded hacker
- random binary backgrounds
- glowing AI brain
- robot shaking hands with human
- generic server-room stock photo

Cyberpunk styling is acceptable as an **accent aesthetic**, not as a substitute for meaningful imagery.

---

# 13. Special Page Patterns

## Resource / Discovery Pages

Resource-heavy pages may use greater information density than articles.

They may include:

- repository cards
- ranked lists
- filters
- categories
- tool metadata
- comparison information

Use strong section hierarchy rather than putting the entire page inside a dashboard grid.

## GitHub Sections

GitHub-related sections should feel native to Codeholics first and GitHub second.

Use repository metadata as structured content.

Do not simply recreate GitHub's card UI.

## Search

Search should prioritize speed and scanability.

Results should emphasize:

1. title
2. excerpt
3. category/tag
4. date

Highlight matching terms subtly.

Avoid modal search unless it materially improves the experience.

---

# 14. Agent Decision Rules

When an AI agent creates or modifies Codeholics UI, follow this order of authority:

```text
1. Existing working Codeholics component
2. DESIGN.md
3. Existing page patterns
4. Astro project instructions
5. OpenSpec feature specification
6. General frontend conventions
7. Agent preference
```

Agent preference is always last.

## Before Creating a New Component

Search the repository for an existing component that solves the same or a similar problem.

If one exists:

```text
reuse → extend → variant → compose
```

before creating something new.

## Before Introducing a New Pattern

Ask:

1. Does Codeholics already have this pattern?
2. Can an existing component be extended?
3. Does the proposed pattern comply with DESIGN.md?
4. Does it work on mobile?
5. Does it work without JavaScript?
6. Is JavaScript actually required?
7. Is it accessible?
8. Does it look intentionally designed?
9. Does it pass the AI Slop Test?

If not, revise before implementation.

---

# 15. Agent Prompt Guide

## Quick Reference

```text
Theme:            System (default) / Light / Dark — class "dark" on <html>

                  Dark        Light
Background:       #0B1220     #F8FAFC
Gradient End:     #071021     #E2E8F0
Surface:          rgba(15,23,42,0.9)       rgba(255,255,255,0.82)
Border:           rgba(148,163,184,0.18)   rgba(148,163,184,0.28)

Text Primary:     #E2E8F0     #1E293B
Text Secondary:   #CBD5E1     #475569
Metadata:         #94A3B8     #64748B

Accent / Link:    #A78BFA     #7C3AED
Accent Hover:     #C4B5FD     #6D28D9
Primary Fill:     #F8FAFC     #020617
Primary Text:     #0B1220     #F8FAFC
Global Focus:     rgba(124,58,237,0.2) in both themes (review contrast)

UI Font:          IBM Plex Sans
Code Font:        JetBrains Mono

Card Radius:      12px
Control Radius:   8px
Tag Radius:       6px

Container:        1280px
Article Width:    70ch

Default Motion:   150ms
Minimum Target:   44px
```

## New Component Prompt

> Create this component according to `DESIGN.md`. First search for existing Codeholics components or patterns that should be reused. Use Astro unless client-side interactivity genuinely requires otherwise. Default to zero client JavaScript. Use semantic props rather than visual configuration props. Follow the defined colors, typography, spacing, border radius, responsive behavior, and accessibility rules. Avoid generic SaaS styling and run the result through the AI Slop Test before considering it complete.

## New Page Prompt

> Design and implement this page as part of Codeholics rather than as an isolated landing page. Follow `DESIGN.md`, reuse existing components, maintain the site's editorial/developer identity, and prioritize meaningful hierarchy over card-heavy layouts. Start mobile-first and progressively enhance for larger screens. Use Astro-native patterns and avoid unnecessary client JavaScript.

## UI Review Prompt

> Review this implementation against `DESIGN.md`. Check visual hierarchy, typography, color usage, spacing rhythm, component reuse, responsiveness, accessibility, Astro architecture, JavaScript usage, and consistency with existing Codeholics patterns. Identify any generic AI-generated design patterns using the AI Slop Test. Recommend specific corrections rather than redesigning components unnecessarily.

---

# 16. Definition of Done

A Codeholics UI implementation is complete only when:

- [ ] It follows this design system.
- [ ] Existing components were reused where appropriate.
- [ ] New components have a clear reason to exist.
- [ ] Astro is used by default.
- [ ] Client-side JavaScript is justified.
- [ ] Tailwind utilities follow established tokens.
- [ ] Desktop layout is polished.
- [ ] Tablet layout is intentional.
- [ ] Mobile layout is intentional.
- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Color contrast meets WCAG AA.
- [ ] It has been verified in **both** light and dark themes, and with the System default.
- [ ] Shared colors reuse the existing theme variables/helpers and preserve the approved live palette.
- [ ] Touch targets meet the 44px minimum.
- [ ] Content works with unusually long titles and descriptions.
- [ ] Empty/optional data states are handled.
- [ ] Motion respects reduced-motion preferences.
- [ ] The page passes the AI Slop Test.
- [ ] `astro check` passes.
- [ ] The production build passes.

---

# Final Principle

Codeholics should look like it was designed and built by someone who understands the technology being written about.

The interface should communicate:

> **"Built by a technologist, for people who like understanding how things actually work."**

When choosing between something fashionable and something purposeful, choose purposeful.

When choosing between clever architecture and simple Astro, choose simple Astro.

When choosing between another visual effect and better readability, choose readability.

When choosing between generic AI design and something recognizably Codeholics, choose Codeholics.