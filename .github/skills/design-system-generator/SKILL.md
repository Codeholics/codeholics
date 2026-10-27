---
name: design-system-generator
description: Generate a structured DESIGN.md file for any business or project. Produces a machine-readable design system specification that build pipelines consume during code generation. Based on VoltAgent/awesome-design-md format.
triggers:
  - generate design system
  - create DESIGN.md
  - design system from scratch
  - design specification
---

# Design System Generator

## How This Skill Works

Takes business context (name, industry, brand personality, existing colors/fonts, inspiration targets) and produces a complete DESIGN.md file with 9 sections (10 for tri-lingual sites). The output is consumed by `website-rebuild`, `local-business-rebuild`, and `azerbaijan-website-build` pipelines during their build phases as the single source of truth for all visual implementation.

The DESIGN.md format is structured for machine consumption. Every value is explicit (hex codes, pixel values, font weights) so that downstream agents can translate the spec directly into CSS/Tailwind without interpretation or guesswork.

## Input Requirements

Gather these before starting generation:

| Input | Required | Description |
|-------|----------|-------------|
| Business name | Yes | Used in theme narrative and agent prompt examples |
| Industry | Yes | Drives aesthetic direction, color psychology, component patterns |
| Brand personality keywords | Yes | 3-5 adjectives (e.g., luxury, friendly, bold, minimal, industrial, warm) |
| Existing brand colors | No | Hex values extracted from logo or brand brief. If provided, derive full palette from these. |
| Existing fonts | No | Font families from brand brief. Verify they are not on the banned list before using. |
| Aesthetic inspiration target | No | Can point to reference files in `00-design-references/references/by-aesthetic/` |
| Multi-lingual requirements | No | If tri-lingual (AZ/RU/EN), triggers Section 10 extension |

If optional inputs are missing, derive sensible defaults from the industry and personality keywords. Do not ask the user to fill in optional fields unless the result would be ambiguous.

## Generation Process

### Step 1: Choose Aesthetic Direction

Read `00-design-references/design-md-index.md` to see the catalog of reference DESIGN.md files organized by aesthetic and industry. Pick 1-2 reference files that match the target business's industry and personality keywords. Read those reference files for structural inspiration only -- do not copy their values. The goal is to understand the level of detail and tone, then produce original values tailored to this specific business.

If no reference files match closely, proceed from first principles using the personality keywords as the primary driver.

### Step 2: Section 1 -- Visual Theme & Atmosphere

Write a 2-3 paragraph narrative describing the design's mood, philosophy, and key characteristics. This should read like an art director's brief, not a template fill-in. Be specific and opinionated.

After the narrative, include a bullet list of 6-8 key characteristics. Example format:

```markdown
## 1. Visual Theme & Atmosphere

[2-3 paragraphs of narrative prose describing the mood, philosophy, and design direction]

**Key Characteristics:**
- [Characteristic 1]
- [Characteristic 2]
- ...
```

Ground every statement in the business context. "Clean and modern" is too generic. "Clinical precision softened by warm terracotta accents, reflecting a construction firm that builds with both engineering rigor and neighborhood familiarity" is specific.

### Step 3: Section 2 -- Color Palette & Roles

**If existing brand colors are provided:** Use them as the foundation. Derive the full palette (primary, secondary, accent, neutrals, surfaces, borders, shadows) by expanding around those anchors.

**If no existing colors are provided:** Derive the palette from industry norms and personality keywords. Research the industry's visual conventions and then either align with or deliberately break from them based on the personality keywords.

Organize the palette into these groups:

```markdown
## 2. Color Palette & Roles

### Primary
| Role | Hex | Usage |
|------|-----|-------|
| Primary | #XXXXXX | Main brand color, CTA backgrounds, key accents |
| Primary Dark | #XXXXXX | Hover states, active states, headers |
| Primary Light | #XXXXXX | Backgrounds, highlights, subtle accents |

### Accent
| Role | Hex | Usage |
|------|-----|-------|
| Accent | #XXXXXX | Secondary actions, highlights, badges |
| Accent Dark | #XXXXXX | Hover states for accent elements |

### Interactive States
| Role | Hex | Usage |
|------|-----|-------|
| Link Default | #XXXXXX | Unvisited links |
| Link Hover | #XXXXXX | Hovered links |
| Link Visited | #XXXXXX | Visited links |
| Focus Ring | #XXXXXX | Focus indicator for keyboard navigation |
| Error | #XXXXXX | Error states, validation failures |
| Success | #XXXXXX | Success states, confirmations |
| Warning | #XXXXXX | Warning states, cautions |

### Neutral Scale
| Role | Hex | Usage |
|------|-----|-------|
| Neutral 950 | #XXXXXX | Primary text |
| Neutral 800 | #XXXXXX | Secondary text |
| Neutral 600 | #XXXXXX | Tertiary text, placeholders |
| Neutral 400 | #XXXXXX | Disabled text, subtle borders |
| Neutral 200 | #XXXXXX | Borders, dividers |
| Neutral 100 | #XXXXXX | Subtle backgrounds |
| Neutral 50 | #XXXXXX | Page background alternate |

### Surface & Borders
| Role | Hex | Usage |
|------|-----|-------|
| Surface Primary | #XXXXXX | Card backgrounds, main surfaces |
| Surface Secondary | #XXXXXX | Alternate surface, sidebar backgrounds |
| Border Default | #XXXXXX | Standard borders |
| Border Subtle | #XXXXXX | Subtle dividers |

### Shadow Colors
| Role | Value | Usage |
|------|-------|-------|
| Shadow Light | rgba(X,X,X,0.05) | Subtle elevation |
| Shadow Medium | rgba(X,X,X,0.10) | Card elevation |
| Shadow Heavy | rgba(X,X,X,0.20) | Modal/dropdown elevation |
```

**Contrast verification is mandatory.** Every text color / background color combination must pass WCAG AA:
- Body text (under 18px or under 14px bold): minimum 4.5:1 contrast ratio
- Large text (18px+ or 14px+ bold): minimum 3:1 contrast ratio

Use the contrast-check script at `05-website-rebuild/scripts/contrast-check.js` to verify. If it is not available, compute ratios manually using the relative luminance formula. Document the computed ratio next to any combination that is close to the threshold.

### Step 4: Section 3 -- Typography Rules

Select fonts from verified candidates. **BANNED FONTS (never use):** Inter, Roboto, Arial, Helvetica, Space Grotesk, Lato, Open Sans, Source Sans Pro. These are overused in AI-generated sites and instantly signal "template."

Define the complete type hierarchy:

```markdown
## 3. Typography Rules

**Primary Font:** [Font Name] (Google Fonts)
**Secondary Font:** [Font Name] (Google Fonts)
**Mono Font:** [Font Name] (Google Fonts) -- for code/data if needed

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | [family] | 64px / 4rem | 700 | 1.1 | -0.02em | Homepage hero only |
| Display Large | [family] | 48px / 3rem | 700 | 1.15 | -0.01em | Major section headers |
| Section Heading | [family] | 36px / 2.25rem | 600 | 1.2 | -0.01em | H2-level headings |
| Sub-heading | [family] | 24px / 1.5rem | 600 | 1.3 | 0 | H3-level headings |
| Body Large | [family] | 18px / 1.125rem | 400 | 1.6 | 0 | Lead paragraphs |
| Body | [family] | 16px / 1rem | 400 | 1.6 | 0 | Standard body text |
| Button | [family] | 16px / 1rem | 600 | 1 | 0.02em | All button labels |
| Small | [family] | 14px / 0.875rem | 400 | 1.5 | 0 | Captions, metadata |
| Caption | [family] | 12px / 0.75rem | 400 | 1.4 | 0.01em | Fine print, timestamps |
```

Every row must have all columns filled. No "inherit" or "default" -- specify the exact value.

### Step 5: Section 4 -- Component Stylings

Define all interactive components with their full state matrix:

```markdown
## 4. Component Stylings

### Buttons

**Primary Button:**
| Property | Value |
|----------|-------|
| Background | #XXXXXX |
| Text Color | #XXXXXX |
| Font | [family], [size], [weight] |
| Padding | Xpx Xpx |
| Border Radius | Xpx |
| Border | none |
| Shadow | [value from elevation scale] |
| Hover Background | #XXXXXX |
| Hover Shadow | [value] |
| Focus Ring | 0 0 0 3px [focus color] |
| Active Background | #XXXXXX |
| Active Transform | translateY(1px) |
| Disabled Background | #XXXXXX |
| Disabled Text | #XXXXXX |
| Transition | all 200ms ease |

**Secondary Button:**
[Same property table with secondary variant values]

**Dark/Inverse Button:**
[Same property table for dark background contexts]

### Cards
| Property | Value |
|----------|-------|
| Background | #XXXXXX |
| Border | 1px solid #XXXXXX |
| Border Radius | Xpx |
| Padding | Xpx |
| Shadow | [value from elevation scale] |
| Hover Shadow | [elevated value] |
| Transition | shadow 200ms ease |

### Inputs
| Property | Value |
|----------|-------|
| Background | #XXXXXX |
| Border | 1px solid #XXXXXX |
| Border Radius | Xpx |
| Padding | Xpx Xpx |
| Font | [family], [size] |
| Placeholder Color | #XXXXXX |
| Focus Border | #XXXXXX |
| Focus Ring | 0 0 0 3px [focus color with alpha] |
| Error Border | #XXXXXX |
| Disabled Background | #XXXXXX |

### Navigation
| Property | Value |
|----------|-------|
| Background | #XXXXXX |
| Height | Xpx |
| Link Color | #XXXXXX |
| Link Hover Color | #XXXXXX |
| Active Link Color | #XXXXXX |
| Active Indicator | [describe: underline, background pill, etc.] |
| Mobile Menu Background | #XXXXXX |
```

Include at minimum: primary button (4 states: default, hover, focus, active), secondary button, dark variant button, cards, inputs, and navigation.

### Step 6: Section 5 -- Layout Principles

```markdown
## 5. Layout Principles

**Base Spacing Unit:** Xpx
**Spacing Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px

**Grid:**
| Property | Value |
|----------|-------|
| Max Container Width | Xpx |
| Grid Columns | 12 |
| Column Gap | Xpx |
| Row Gap | Xpx |

**Section Spacing:**
| Context | Value |
|---------|-------|
| Between major sections | Xpx |
| Between sub-sections | Xpx |
| Between content blocks | Xpx |

**Border Radius Scale:**
| Size | Value | Usage |
|------|-------|-------|
| Small | Xpx | Inputs, small badges |
| Medium | Xpx | Cards, buttons |
| Large | Xpx | Feature cards, images |
| Full | 9999px | Pills, avatars |
```

Base the spacing unit on 4px or 8px. The scale should be geometric or follow a consistent rhythm. Justify the max container width for the industry (marketing sites often use wider containers than editorial sites).

### Step 7: Section 6 -- Depth & Elevation

Define 4-5 elevation levels with exact CSS `box-shadow` values:

```markdown
## 6. Depth & Elevation

| Level | Name | CSS box-shadow | Usage |
|-------|------|---------------|-------|
| 0 | Flat | none | Default state, inline elements |
| 1 | Subtle | 0 1px 2px rgba(X,X,X,0.05) | Resting cards, subtle separation |
| 2 | Raised | 0 4px 6px rgba(X,X,X,0.07), 0 2px 4px rgba(X,X,X,0.05) | Hovered cards, dropdowns |
| 3 | Elevated | 0 10px 15px rgba(X,X,X,0.10), 0 4px 6px rgba(X,X,X,0.05) | Modals, popovers, floating elements |
| 4 | Floating | 0 20px 25px rgba(X,X,X,0.15), 0 10px 10px rgba(X,X,X,0.05) | Dragged elements, sticky headers |
```

The shadow RGB values should derive from the shadow colors defined in Section 2. Do not use pure black (`0,0,0`) unless the design is intentionally stark.

### Step 8: Section 7 -- Do's and Don'ts

Generate rules specific to this design system. Cross-reference banned items from `03-web-design-guidelines/design-rules.md` (banned fonts, banned color schemes, banned layouts).

```markdown
## 7. Do's and Don'ts

### Do's
1. [Specific positive rule grounded in this design system]
2. [...]
...8-12 total

### Don'ts
1. [Specific prohibition grounded in this design system]
2. [...]
...8-12 total

### The AI Slop Test
> If someone saw this and was told AI made it, would they believe it? If yes, redesign.

Apply this test to every page and component. Common AI tells to avoid:
- Generic hero sections with centered text over stock gradient
- Perfectly symmetrical 3-column feature grids
- Overuse of rounded corners on everything
- Teal + coral color schemes
- "Welcome to [Business Name]" as a headline
- Decorative SVG blobs with no purpose
```

The do's and don'ts must be specific to the generated design system, not generic platitudes. Reference exact colors, fonts, and spacing values from earlier sections where possible.

### Step 9: Section 8 -- Responsive Behavior

```markdown
## 8. Responsive Behavior

### Breakpoints
| Name | Width | Columns | Container Padding |
|------|-------|---------|-------------------|
| Mobile | 375px | 4 | 16px |
| Tablet | 768px | 8 | 24px |
| Desktop | 1024px | 12 | 32px |
| Large | 1280px | 12 | 48px |
| XL | 1536px | 12 | 64px |

### Touch Targets
- Minimum touch target size: 44px x 44px
- Minimum spacing between touch targets: 8px

### Typography Scaling
| Role | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| Display Hero | Xrem | Xrem | Xrem |
| Display Large | Xrem | Xrem | Xrem |
| Section Heading | Xrem | Xrem | Xrem |
| Body | 1rem | 1rem | 1rem |

### Collapsing Strategy
- **Navigation:** Hamburger menu below [breakpoint]. Full horizontal nav at [breakpoint] and above.
- **Grid layouts:** Single column on mobile, 2 columns on tablet, full grid on desktop.
- **Hero sections:** Stack vertically on mobile. Side-by-side on desktop.
- **Cards:** Full-width stack on mobile. 2-column grid on tablet. 3-4 column grid on desktop.
- **Images:** Full-bleed on mobile. Contained on desktop.
```

Font scaling should reduce display sizes significantly on mobile (typically 60-70% of desktop values) while keeping body text at 1rem across all breakpoints.

### Step 10: Section 9 -- Agent Prompt Guide

This section gives downstream agents copy-paste-ready prompts with exact values:

```markdown
## 9. Agent Prompt Guide

### Quick Color Reference
- Primary: #XXXXXX
- Primary Dark: #XXXXXX
- Accent: #XXXXXX
- Text Primary: #XXXXXX
- Text Secondary: #XXXXXX
- Background: #XXXXXX
- Surface: #XXXXXX

### Example Component Prompts

**Hero Section:**
"Create a hero section on [bg color]. Headline at [size] [font] weight [weight], line-height [value], letter-spacing [value], color [hex]. Subheadline at [size] [font] weight [weight], color [hex]. CTA button: background [hex], text [hex], padding [value], border-radius [value], font [size] weight [weight]."

**Service Card:**
"Build a service card with background [hex], border [value], border-radius [value], shadow [exact shadow value], padding [value]. Title at [size] [font] weight [weight] color [hex]. Description at [size] [font] color [hex]. Link in [hex], hover [hex]."

**Contact Form:**
"Create a contact form. Labels at [size] [font] weight [weight] color [hex]. Inputs: background [hex], border [value], border-radius [value], padding [value], focus ring [value]. Submit button uses primary button styling."

**Footer:**
"Build a footer on [bg color]. Heading text at [size] [font] weight [weight] color [hex]. Body text at [size] color [hex]. Links in [hex], hover [hex]. Grid: [columns] columns on desktop, single column on mobile."
```

Every value in the prompts must match a value defined in the earlier sections. No approximations, no "similar to" -- exact hex codes, exact pixel values, exact font specs.

### Step 11 (Optional): Section 10 -- Multi-Lingual Considerations

Only generate this section for tri-lingual (AZ/RU/EN) sites:

```markdown
## 10. Multi-Lingual Considerations

### Font Verification
Selected fonts must render all characters in this test string:

**Azerbaijani:** Ə ə Ğ ğ İ ı Ö ö Ü ü Ç ç Ş ş
**Russian:** А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я

Verify in Google Fonts that both the primary and secondary fonts support Latin Extended-A (Azerbaijani) and Cyrillic (Russian) character sets before finalizing the typography selection.

### Text Expansion Accommodation
Russian text is approximately 30% longer than English equivalents. All layouts must accommodate:
- Navigation labels: allow 30% extra width or use truncation with tooltip
- Buttons: use padding-based sizing, not fixed widths
- Headlines: test with longest Russian translation to verify no overflow
- Card descriptions: set min-height rather than fixed height

### Cultural Color Considerations for Azerbaijan
- Red and green carry national flag significance (avoid using them trivially)
- Blue is the primary flag color and generally positive
- Gold/warm tones resonate with cultural heritage
- Conservative industries may expect more formal, muted palettes

### Per-Language Content Tone
| Language | Tone | Formality |
|----------|------|-----------|
| Azerbaijani (AZ) | Warm, direct | Formal (siz) |
| Russian (RU) | Professional, clear | Formal (Вы) |
| English (EN) | Approachable, confident | Professional casual |
```

## Validation Checklist

After generating the DESIGN.md, run through this checklist before saving:

- [ ] All 9 sections present (10 if tri-lingual)
- [ ] All hex values are valid 6-digit format (`#RRGGBB`)
- [ ] All text/background contrast ratios computed and WCAG AA passing (4.5:1 body, 3:1 large text)
- [ ] Typography table has all required columns (Role, Font, Size, Weight, Line Height, Letter Spacing, Notes)
- [ ] Typography table has all required rows (Display Hero, Display Large, Section Heading, Sub-heading, Body, Button, Small, Caption)
- [ ] No banned fonts used (Inter, Roboto, Arial, Helvetica, Space Grotesk, Lato, Open Sans, Source Sans Pro)
- [ ] Component stylings include primary button (default, hover, focus, active states), secondary button, dark button, cards, inputs, navigation
- [ ] At least 4 shadow/elevation levels defined with exact CSS box-shadow values
- [ ] No banned color schemes used (check against design-rules.md)
- [ ] Spacing scale defined with explicit base unit
- [ ] Border radius scale defined
- [ ] Breakpoints table complete with all 5 breakpoints
- [ ] Touch target minimums specified (44px)
- [ ] Font scaling table provided for mobile/tablet/desktop
- [ ] Agent prompt examples use exact values from the design system (verify by spot-checking 3+ values)
- [ ] AI Slop Test section included in Do's and Don'ts

## Output

Save the completed file as `DESIGN.md` in the project root directory. This file is the single source of truth for all visual implementation in downstream build pipelines. No design decisions should be made outside of this file during the build phase.
