# Copilot Instructions for Codeholics

Quick reference for Copilot and AI coding agents working in this repository.

---

## Active Stack

- This repository is Astro-first and Astro-only for production workflows.
- UI is built with Astro and Tailwind CSS.
- Legacy Pelican production paths are retired.
- URL migration policy is break-and-reindex; do not assume legacy URL preservation.
- Prefer Astro-native solutions over client-side frameworks.
- Default to zero client-side JavaScript unless interaction genuinely requires it.

---

## Build, Test, and Lint Commands

Run Astro commands from `astro/`.

- Install dependencies: `npm install`
- Dev server: `astro dev --background`
- Stop dev server: `astro dev stop`
- Dev server status: `astro dev status`
- Dev server logs: `astro dev logs`
- Production build: `npm run build`
- Preview: `npm run preview`
- Legacy parity gate: `npm run verify:legacy-content-parity`
- Inline code lint: `npm run lint:inline-code`
- Inline code strict: `npm run lint:inline-code:strict`
- Metadata warning check (AI flow): `npm run ai:post:finalize -- --file src/content/posts/<slug>.md`
- Metadata warning check (manual): `npm run lint:post-metadata -- --file src/content/posts/<slug>.md`

Before considering implementation complete, run the checks relevant to the files changed.

For UI or component work, at minimum ensure the production build succeeds.

---

## High-Level Architecture

- Repository root: `/`
- Astro application: `/astro`
- Astro source: `/astro/src`
- Components: `/astro/src/components`
- Layouts: `/astro/src/layouts`
- Pages: `/astro/src/pages`
- Post content: `/astro/src/content/posts`
- Public assets: `/astro/public`
- Build output: `/astro/dist`
- Design system: `/DESIGN.md`
- OpenSpec: `/openspec`
- Copilot instructions: `/.github`
- CI/deploy workflows:
  - `/.github/workflows/build.yml`
  - `/.github/workflows/deploy.yml`

Do not assume files belong at the repository root when they belong inside the Astro application.

---

## General Engineering Conventions

- Prefer minimal, focused edits aligned with the existing Astro architecture.
- Search the repository before introducing a new abstraction, component, helper, or pattern.
- Reuse existing implementations when appropriate.
- Do not reintroduce Pelican build or deployment instructions into active documentation or workflows.
- Keep metadata checks warning-only unless explicitly changed by a future specification.
- For content migration or cutover work, run `npm run verify:legacy-content-parity` before destructive removals.
- Avoid unrelated refactoring while implementing a scoped change.
- Preserve established naming and directory conventions.

## Workspace and Temporary Files

- Do not write temporary or scratch files (screenshots, logs, generated output) into the repository unless they are part of the requested change.
- Before writing anything outside the workspace, ask the user which directory to use and explain what will be written and why it should stay out of the repository.
- Use only the directory the user approves; do not choose a location on your own.

---

# Astro Architecture

Follow `/.github/instructions/astro.instructions.md` for Astro-specific
implementation details.

Codeholics should remain Astro-native.

## Astro First

Prefer `.astro` components for UI and static presentation.

Do not introduce:

- React
- Vue
- Svelte
- Solid
- another client-side UI framework

unless the requested functionality genuinely requires it and the existing Astro architecture cannot reasonably provide it.

## Zero JavaScript by Default

Start every component with a client-side JavaScript budget of zero.

Before introducing client-side JavaScript, consider whether the behavior can be implemented with:

1. semantic HTML
2. CSS
3. native browser behavior
4. a small vanilla script
5. a Web Component

Use Astro hydration directives only when hydration is genuinely required.

Do not use `client:*` merely because a component contains interaction.

---

# Component Development

Before creating a new component:

1. Search for an existing Codeholics component or pattern.
2. Reuse it if possible.
3. Extend it if appropriate.
4. Add a semantic variant if appropriate.
5. Compose existing primitives if appropriate.
6. Create a new component only when the previous options do not adequately solve the problem.

Prefer:

```text
reuse → extend → variant → compose → create
```

## Component APIs

Component props should describe meaning and behavior rather than arbitrary styling.

Prefer semantic APIs such as:

```astro
<RepoCard
  repo={repo}
  featured={true}
/>
```

Avoid APIs that expose the design system through arbitrary styling props such as:

```astro
<RepoCard
  padding="24px"
  radius="12px"
  titleColor="#38BDF8"
/>
```

Colors, spacing, typography, radii, and other visual tokens belong to the design system.

---

# Codeholics UI Development

`/DESIGN.md` is the authoritative visual design system for Codeholics.

Before creating or modifying any user-facing page, layout, component, or UI:

1. Read the relevant OpenSpec requirements when the work belongs to an OpenSpec change.
2. Read `/DESIGN.md`.
3. Follow `/.github/instructions/astro.instructions.md`.
4. Inspect existing Codeholics components and nearby page patterns.
5. Reuse existing patterns before introducing new ones.
6. Apply the `frontend-design` skill from `/.github/skills/frontend-design/`
   for visual composition and UI design.
7. Apply the `responsive-design` skill from `/.github/skills/responsive-design/`
   for responsive behavior.
8. Apply `web-design-guidelines` from `/.github/skills/web-design-guidelines/`
   for accessibility and general UI quality.
9. Review completed UI with `web-design-reviewer` from
   `/.github/skills/web-design-reviewer/` when appropriate.

---

## Design Rules

- Follow the colors, typography, spacing, radii, surfaces, borders, and component patterns defined in `/DESIGN.md`.
- Do not introduce a new visual language for individual pages.
- Do not introduce new design tokens when existing tokens solve the problem.
- Avoid generic SaaS-style layouts.
- Avoid stereotypical AI-generated UI.
- Follow the AI Slop Test defined in `/DESIGN.md`.
- New UI must be responsive.
- New UI must be accessible.
- Technical aesthetics must not reduce readability.
- Do not overuse cards, gradients, glow, pills, glass effects, or monospace typography.
- Visual effects must have a purpose.
- Prefer content hierarchy over decoration.

---

# Responsive Development

Treat responsive behavior as part of the initial implementation, not a cleanup step.

Develop mobile-first.

Every new or substantially modified UI should be evaluated at:

- mobile
- tablet
- desktop
- large desktop where relevant

Do not simply stack desktop components on mobile without considering whether the information hierarchy still makes sense.

Avoid fixed dimensions when content may vary.

Account for:

- long titles
- long descriptions
- missing optional metadata
- overflowing code
- wide tables
- navigation constraints
- touch targets
- images with different aspect ratios

Follow the responsive rules in `/DESIGN.md` and the `responsive-design` skill.

---

# Accessibility

Accessibility is part of implementation, not a later review phase.

Use:

- semantic HTML
- correct heading hierarchy
- native controls when possible
- visible keyboard focus
- meaningful link text
- accessible form labels
- sufficient color contrast
- keyboard-accessible interaction
- appropriate alt text
- reduced-motion support

Use ARIA only when native HTML semantics are insufficient.

Do not use ARIA to compensate for incorrect HTML structure.

Interactive elements must remain understandable without relying solely on:

- color
- hover
- animation
- icons

---

# Tailwind CSS

Use Tailwind consistently with the existing Codeholics implementation.

Prefer established utilities and design tokens.

Avoid arbitrary values when a standard project value already exists.

Prefer:

```text
gap-6
p-6
rounded-xl
```

over unnecessary values such as:

```text
gap-[23px]
p-[25px]
rounded-[13px]
```

Arbitrary values are acceptable when an actual design requirement requires precision.

Do not create a new Tailwind convention when the repository already has an established solution.

---

# OpenSpec

OpenSpec defines the requirements and scope of a change.

For work associated with an OpenSpec change:

```text
OpenSpec
    ↓
WHAT must be built

DESIGN.md
    ↓
HOW the UI should look and behave

Astro instructions
    ↓
HOW the implementation should be architected

Specialized skills
    ↓
HOW to improve and validate the implementation
```

When implementing an OpenSpec change involving UI, consult `/DESIGN.md` before implementation.

Do not silently change the design system to satisfy a feature specification.

If an OpenSpec change intentionally introduces or modifies a reusable design-system pattern, update `/DESIGN.md` as part of the change.

---

# Instruction Authority

When instructions appear to conflict, use this priority:

1. Explicit requirements of the current task
2. Accepted OpenSpec requirements for the current change
3. Existing Codeholics architecture and established component patterns
4. `/DESIGN.md`
5. Astro project instructions
6. Specialized project skills
7. General frontend conventions
8. Agent preference

However, an OpenSpec feature requirement does not automatically authorize changing the global design system.

If satisfying a specification appears to require violating `/DESIGN.md`, determine whether:

- the requirement can be implemented within the existing design system;
- an existing component can be extended;
- a semantic component variant is appropriate; or
- the design system itself intentionally needs to change.

If the design system must change, update `/DESIGN.md` explicitly rather than creating an undocumented exception.

Agent preference is always the lowest priority.

---

# UI Review

Before considering substantial UI work complete, review the implementation against `/DESIGN.md`.

Check:

- visual hierarchy
- typography
- spacing rhythm
- color usage
- component reuse
- responsive behavior
- mobile usability
- accessibility
- keyboard interaction
- focus states
- Astro architecture
- unnecessary JavaScript
- Tailwind consistency
- content overflow
- empty or optional states
- reduced-motion behavior

Then apply the AI Slop Test from `/DESIGN.md`.

Do not redesign working UI merely to make it different.

Review should identify concrete problems and make focused corrections.

---

# Definition of Done for UI Work

UI work is complete when:

- [ ] OpenSpec requirements are satisfied, when applicable.
- [ ] `/DESIGN.md` has been followed.
- [ ] Existing components were reused where appropriate.
- [ ] New components have a clear reason to exist.
- [ ] Astro-native implementation was preferred.
- [ ] Client-side JavaScript is justified.
- [ ] Tailwind follows existing project conventions.
- [ ] Mobile behavior is intentional.
- [ ] Tablet behavior is intentional.
- [ ] Desktop behavior is intentional.
- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Content remains usable with long or missing values.
- [ ] Accessibility requirements are satisfied.
- [ ] Motion respects reduced-motion preferences.
- [ ] The implementation passes the AI Slop Test.
- [ ] Relevant lint or validation commands pass.
- [ ] `npm run build` passes.

---

# Core Principle

Codeholics should look and behave like a site built by someone who understands the technology being discussed.

Prefer:

**purpose over fashion**

**content over decoration**

**Astro over unnecessary frameworks**

**HTML/CSS over unnecessary JavaScript**

**reuse over duplication**

**semantic variants over styling props**

**established Codeholics patterns over generic AI design**

When uncertain, inspect the existing project before inventing a new solution.