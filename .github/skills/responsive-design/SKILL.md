---
name: responsive-design
description: >
  Responsive web design sub-skill. Provides mobile-first layout patterns,
  CSS Grid/Flexbox strategies, responsive images, fluid typography, container
  queries, and breakpoint systems. Pull this in whenever building or reviewing
  UI that must work across mobile, tablet, desktop, and large screens.
  Triggers on: "make it responsive", "responsive design", "mobile-first",
  "breakpoints", "fluid layout", or any request involving cross-device layout.
---

# Responsive Design

Comprehensive responsive web design patterns for building layouts that adapt seamlessly across all device types and screen sizes. This is a **sub-skill** — pull it into any design or build workflow that needs cross-device support.

## When to Use This Skill

- Building any new page or component that must work on mobile + desktop
- Reviewing or fixing responsive layout issues
- Converting a fixed-width design to responsive
- Setting up a breakpoint system for a new project
- Optimizing images and typography for multiple viewports

## Standard Breakpoint System

Use these as the default breakpoints unless the project specifies otherwise:

```css
:root {
  --breakpoint-sm: 640px;   /* Large phones */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Small desktops */
  --breakpoint-xl: 1280px;  /* Desktops */
  --breakpoint-2xl: 1536px; /* Large screens */
}
```

**Tailwind equivalents:** `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## Step 1: Mobile-First Approach

ALWAYS design starting from the smallest screen (320px+) and progressively enhance for larger viewports.

```css
/* Base styles = mobile (no media query needed) */
.container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    flex-direction: row;
    gap: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem;
  }
}
```

**Rules:**
- MUST use `min-width` media queries (mobile-first), NOT `max-width`
- MUST include `<meta name="viewport" content="width=device-width, initial-scale=1">` in HTML
- MUST use relative units (`rem`, `em`, `%`, `vw`, `vh`) — NOT fixed `px` for layout widths
- MUST NOT set fixed widths like `width: 1200px` — use `max-width` instead

## Step 2: Layout Patterns

### Flexbox — Use for 1-dimensional layouts

**Responsive navigation:**
```css
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
```

**Card row that wraps:**
```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 100%;           /* Full width on mobile */
}

@media (min-width: 768px) {
  .card { flex: 1 1 45%; }  /* 2 columns on tablet */
}

@media (min-width: 1024px) {
  .card { flex: 1 1 30%; }  /* 3 columns on desktop */
}
```

### CSS Grid — Use for 2-dimensional layouts

**Auto-responsive grid (no media queries needed):**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

**Dashboard layout with sidebar:**
```css
.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .dashboard {
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr;
  }
}

@media (min-width: 1280px) {
  .dashboard {
    grid-template-columns: 280px 1fr 300px;
  }
}
```

### Decision Guide

| Use Case | Use |
|----------|-----|
| Nav bar, button group, toolbar | Flexbox |
| Card grid, gallery, product list | Grid (`auto-fit`) |
| Full page layout with sidebar | Grid (explicit columns) |
| Centering a single element | Flexbox |
| Complex 2D dashboard | Grid |

## Step 3: Responsive Images

**srcset for resolution switching:**
```html
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Descriptive alt text"
  loading="lazy"
  decoding="async"
/>
```

**Art direction with `<picture>`:**
```html
<picture>
  <source media="(min-width: 1024px)" srcset="hero-wide.webp" type="image/webp" />
  <source media="(min-width: 768px)" srcset="hero-medium.webp" type="image/webp" />
  <img src="hero-mobile.jpg" alt="Hero image" loading="lazy" />
</picture>
```

**Rules:**
- MUST include `loading="lazy"` on below-the-fold images
- MUST include meaningful `alt` text
- MUST provide WebP/AVIF formats when possible
- MUST size images appropriately — don't serve 2000px images to mobile
- Use Astro `<Image>` component when in Astro projects (handles optimization automatically)

## Step 4: Fluid Typography

Use `clamp()` for typography that scales smoothly without breakpoints:

```css
:root {
  /* clamp(min, preferred, max) */
  --text-sm: clamp(0.8rem, 0.75rem + 0.25vw, 0.875rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.25rem, 1rem + 1vw, 1.5rem);
  --text-xl: clamp(1.5rem, 1.1rem + 1.5vw, 2rem);
  --text-2xl: clamp(1.875rem, 1.2rem + 2.5vw, 3rem);
  --text-3xl: clamp(2.25rem, 1.5rem + 3vw, 4rem);
}

h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
h3 { font-size: var(--text-xl); }
p  { font-size: var(--text-base); }
```

**Rules:**
- MUST use `clamp()` or relative units for font sizes — NOT fixed `px`
- Minimum readable body text: `16px` (`1rem`)
- Line height should scale inversely: larger text = tighter line-height
- Touch targets: minimum `44px` height on interactive elements

## Step 5: Container Queries (Modern CSS)

For component-level responsiveness independent of viewport:

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: flex;
  flex-direction: column;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row;
    align-items: center;
  }
}

@container card (min-width: 600px) {
  .card {
    gap: 2rem;
  }
  .card-image {
    flex: 0 0 40%;
  }
}
```

**When to use:**
- Reusable components that live in different layout contexts (sidebar vs. main content)
- Design system components that need intrinsic responsiveness
- Widget/card patterns that should adapt to their container, not the viewport

**Browser support:** All modern browsers. Safe to use in 2025+ projects.

## Step 6: Common Responsive Patterns

### Show/Hide Elements
```css
.mobile-menu { display: block; }
.desktop-nav { display: none; }

@media (min-width: 768px) {
  .mobile-menu { display: none; }
  .desktop-nav { display: flex; }
}
```

### Responsive Spacing
```css
.section {
  padding: clamp(2rem, 5vw, 6rem) clamp(1rem, 3vw, 4rem);
}
```

### Responsive Table → Card Pattern
```css
/* On mobile, transform table rows into stacked cards */
@media (max-width: 767px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }
  thead { display: none; }
  td::before {
    content: attr(data-label);
    font-weight: bold;
    display: block;
  }
}
```

## Constraints — Hard Rules

| Rule | Details |
|------|---------|
| MUST | Include viewport meta tag in all HTML documents |
| MUST | Use mobile-first (`min-width`) media queries |
| MUST | Use relative units for layout (`rem`, `%`, `vw`) |
| MUST | Test at exact breakpoints: 320, 768, 1024, 1280, 1536 |
| MUST | Ensure touch targets are at least 44px |
| MUST NOT | Use fixed widths (`width: 1200px`) — use `max-width` |
| MUST NOT | Duplicate base styles across all breakpoints (DRY) |
| MUST NOT | Use device-specific breakpoints (e.g., "iPhone 14") |
| MUST NOT | Hide essential content on mobile — restructure instead |

## Testing Checklist

Before considering any responsive implementation complete:

- [ ] Renders correctly at 320px width (smallest common mobile)
- [ ] Renders correctly at 768px (tablet portrait)
- [ ] Renders correctly at 1024px (tablet landscape / small desktop)
- [ ] Renders correctly at 1280px (standard desktop)
- [ ] Renders correctly at 1536px+ (large screens)
- [ ] No horizontal scrollbar at any viewport
- [ ] Touch targets are at least 44px on mobile
- [ ] Images scale appropriately and don't overflow
- [ ] Text remains readable at all sizes (min 16px body)
- [ ] Navigation is accessible on all viewports
- [ ] Forms are usable on mobile (proper input types, sizing)

## Tailwind CSS Quick Reference

When using Tailwind (v3 or v4), apply responsive prefixes:

```html
<!-- Stack on mobile, row on tablet, 3-col grid on desktop -->
<div class="flex flex-col md:flex-row lg:grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  <div class="w-full md:w-1/2 lg:w-auto">...</div>
</div>

<!-- Fluid text -->
<h1 class="text-2xl md:text-4xl lg:text-5xl">Heading</h1>

<!-- Responsive padding -->
<section class="px-4 py-8 md:px-8 md:py-12 lg:px-16 lg:py-20">...</section>

<!-- Hide/show -->
<nav class="hidden md:flex">Desktop Nav</nav>
<button class="md:hidden">Menu</button>
```

## Integration with Other Skills

This skill works as a sub-skill for:
- **frontend-design** — pull in when building any UI component
- **local-business-rebuild** — all prospect sites must be fully responsive
- **website-rebuild** — responsive is a core requirement
- **prospect-qa** — use the testing checklist during QA reviews
