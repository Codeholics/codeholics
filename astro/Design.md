# Codeholics Design System

> **Status:** Authoritative  
> **Scope:** All Codeholics pages, layouts, and UI components  
> **Stack:** Astro + Tailwind CSS  
> **Purpose:** Single source of truth for human and AI-assisted UI development

---

# 1. Visual Theme & Atmosphere

Codeholics is a technical publication built around curiosity, experimentation, systems engineering, open technology, and the culture of learning by building.

The interface should feel like a modern developer workstation translated into an editorial website: dark, precise, technical, information-dense when appropriate, but never cluttered. Terminal and Linux influences are welcome, but Codeholics must not look like a stereotypical "hacker" website.

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

- Dark-first interface
- Strong typographic hierarchy
- Terminal-inspired details used selectively
- Thin borders instead of excessive shadows
- Subtle blue/cyan technical accents
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

Codeholics uses a cool, dark neutral palette with restrained blue/cyan accents.

Bright accent colors should be rare enough that they naturally attract attention.

## Primary

| Role | Hex | Usage |
|---|---|---|
| Primary | `#38BDF8` | Primary links, important accents, active states |
| Primary Dark | `#0284C7` | Hover/pressed states |
| Primary Light | `#7DD3FC` | High-emphasis text and subtle highlights |
| Primary Muted | `#0C4A6E` | Accent backgrounds and subtle selected states |

## Secondary Accent

| Role | Hex | Usage |
|---|---|---|
| Accent | `#22D3EE` | Terminal accents, small highlights, technical indicators |
| Accent Dark | `#0891B2` | Hover/active accent states |
| Accent Soft | `#164E63` | Low-emphasis accent surfaces |

Primary and accent colors should **not** become large decorative gradients.

They exist primarily for hierarchy and interaction.

## Neutral Scale

| Role | Hex | Usage |
|---|---|---|
| Neutral 50 | `#F8FAFC` | Maximum-emphasis text |
| Neutral 100 | `#F1F5F9` | Primary headings |
| Neutral 200 | `#E2E8F0` | Primary body text |
| Neutral 300 | `#CBD5E1` | Secondary text |
| Neutral 400 | `#94A3B8` | Metadata |
| Neutral 500 | `#64748B` | Disabled / tertiary text |
| Neutral 600 | `#475569` | Strong borders |
| Neutral 700 | `#334155` | Elevated borders |
| Neutral 800 | `#1E293B` | Elevated surfaces |
| Neutral 900 | `#0F172A` | Secondary background |
| Neutral 950 | `#020617` | Deep background |

## Surface Colors

| Role | Hex | Usage |
|---|---|---|
| Page Background | `#020617` | Primary site background |
| Surface Primary | `#0F172A` | Cards and major contained surfaces |
| Surface Secondary | `#111827` | Alternate surface |
| Surface Elevated | `#172033` | Dropdowns, menus, elevated UI |
| Surface Hover | `#1E293B` | Hovered cards and interactive rows |
| Code Background | `#020617` | Code blocks and terminal surfaces |

## Borders

| Role | Hex | Usage |
|---|---|---|
| Border Subtle | `#1E293B` | Default separation |
| Border Default | `#334155` | Visible component borders |
| Border Strong | `#475569` | High-emphasis boundaries |
| Border Accent | `#0EA5E9` | Selected/focused elements |

## Interactive States

| Role | Hex | Usage |
|---|---|---|
| Link Default | `#38BDF8` | Links |
| Link Hover | `#7DD3FC` | Hovered links |
| Link Visited | `#A78BFA` | Optional visited article links |
| Focus Ring | `#38BDF8` | Keyboard focus |
| Success | `#4ADE80` | Success states |
| Warning | `#FBBF24` | Warnings |
| Error | `#F87171` | Errors |
| Info | `#38BDF8` | Informational state |

## Color Usage Rule

The majority of any page should consist of:

`#020617`, `#0F172A`, `#1E293B`, `#E2E8F0`, and `#94A3B8`.

Accent colors should generally occupy **less than 10% of the visible interface**.

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
| Background | `#0284C7` |
| Text | `#F8FAFC` |
| Font | IBM Plex Sans, 14px, 600 |
| Padding | `10px 16px` |
| Minimum Height | `44px` |
| Radius | `8px` |
| Border | `1px solid #0EA5E9` |
| Shadow | Elevation 1 |
| Hover | `#0369A1` |
| Focus Ring | `0 0 0 3px rgba(56,189,248,0.35)` |
| Active Transform | `translateY(1px)` |
| Disabled Opacity | `0.50` |
| Transition | `150ms ease` |

### Secondary Button

| Property | Value |
|---|---|
| Background | `transparent` |
| Text | `#CBD5E1` |
| Border | `1px solid #334155` |
| Hover Background | `#1E293B` |
| Hover Border | `#475569` |
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
| Background | `#0F172A` |
| Border | `1px solid #1E293B` |
| Radius | `12px` |
| Padding | `24px` |
| Shadow | Elevation 0 or 1 |
| Hover Border | `#334155` |
| Hover Background | `#111C2F` |
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

Do not simply make every featured card glow neon blue.

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
Background: #0F172A
Border: #334155
Text: #94A3B8
```

Hover:

```text
Border: #38BDF8
Text: #7DD3FC
```

Avoid large collections of brightly colored tags.

---

## Inputs

| Property | Value |
|---|---|
| Background | `#020617` |
| Border | `1px solid #334155` |
| Text | `#E2E8F0` |
| Placeholder | `#64748B` |
| Radius | `8px` |
| Padding | `10px 12px` |
| Minimum Height | `44px` |
| Focus Border | `#38BDF8` |
| Focus Ring | `0 0 0 3px rgba(56,189,248,0.20)` |
| Error Border | `#F87171` |
| Disabled Background | `#0F172A` |

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
Background: #020617
Border: 1px solid #1E293B
Radius: 10px
Font: JetBrains Mono
Font Size: 14px
Line Height: 1.65
```

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

Use four semantic callout types:

```text
INFO
TIP
WARNING
DANGER
```

Callouts use:

- dark neutral background
- colored left border
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

| Level | Name | CSS |
|---|---|---|
| 0 | Flat | `none` |
| 1 | Subtle | `0 1px 2px rgba(2,6,23,0.35)` |
| 2 | Raised | `0 4px 12px rgba(2,6,23,0.35)` |
| 3 | Elevated | `0 12px 30px rgba(2,6,23,0.45)` |
| 4 | Floating | `0 20px 50px rgba(2,6,23,0.55)` |

Use:

- Level 0 for most content
- Level 1 for interactive cards
- Level 2 for dropdowns
- Level 3 for dialogs
- Level 4 extremely rarely

## Glow

Accent glow is permitted only for high-value visual emphasis.

Example:

```css
box-shadow:
  0 0 0 1px rgba(56, 189, 248, 0.12),
  0 0 32px rgba(14, 165, 233, 0.08);
```

Never apply glow to every card.

---

# 7. Do's and Don'ts

## Do

1. Prioritize article readability over decorative UI.
2. Use `#38BDF8` strategically for meaningful emphasis.
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

Desktop:

```text
Horizontal navigation
```

Mobile:

```text
Compact menu / drawer
```

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
#94A3B8
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
Background:       #020617
Surface:          #0F172A
Surface Elevated: #172033
Border:           #334155

Text Primary:     #E2E8F0
Text Secondary:   #94A3B8

Primary:          #38BDF8
Primary Dark:     #0284C7
Accent:           #22D3EE

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