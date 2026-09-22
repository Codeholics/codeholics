---
title: "Migrating Codeholics from Pelican to Astro"
author: "vesc"
date: "2026-09-22 15:14"
category: "Coding"
tags: "coding, astro, pelican, migration, copilot cli, openspec, ai, static site"
slug: "migrating-codeholics-from-pelican-to-astro"
summary: "A draft look at why Codeholics is moving from Pelican to Astro, and how Copilot CLI and OpenSpec are shaping the migration process."
status: "draft"
---

> **Draft note:** This post is intentionally being published as a draft because the migration is still in progress. We'll keep updating it as we finish more of the move.

For years Codeholics has been powered by Pelican, and it has served the site well. The workflow was simple, the output was fast, and it fit the original needs of the project. Over time though, the frontend started to feel harder to evolve. As the site design and navigation needs changed, we wanted a stack that still produced a static site but gave us a more modern component model and a smoother path for UI improvements.

That is what pushed us toward Astro.

Astro keeps the static-site benefits we care about while making it easier to build a more modern frontend. In this repository the new work lives in the `astro/` directory, where we can iterate on layouts, components, search, and navigation without disturbing the legacy Pelican site while the migration is still underway. Instead of trying to do a risky one-shot cutover, we are moving in stages and validating each piece as we go.

## Why move from Pelican?

This is not a post about Pelican being bad. Quite the opposite: Pelican helped Codeholics move away from Wordpress years ago and made the site easier to manage in Git. It gave us a clean content workflow based on Markdown and static output, and that was a big step forward for reliability and maintainability.

The main reason for the new move is that the frontend has different needs now than it did when the Pelican version was first put together. We wanted:

* a cleaner component-based UI structure
* an easier path for modern navigation and search improvements
* better control over responsive behavior
* a workflow that makes frontend iteration faster while keeping the site static

Astro has been a good fit for that direction so far.

## How we are approaching the migration

The current approach is to run both worlds in parallel for a while. The existing Pelican content is still valuable, so we are not throwing it away and starting over. Instead, we are migrating content, layouts, and behavior piece by piece.

So far that has meant:

* keeping the established Markdown content model
* building the new Astro site alongside the existing Pelican site
* recreating major UI pieces incrementally instead of redesigning everything at once
* verifying behavior as features move over, especially navigation and search

That slower approach lowers risk and makes it easier to spot regressions before the final cutover.

## Where Copilot CLI has helped

One of the more interesting parts of this migration has been using Copilot CLI directly inside the repository while working through the changes. For this kind of project, it has been useful because the work is not just writing new files. A migration like this involves reading a lot of existing code and content, tracing how pages are generated, comparing old behavior to new behavior, and then making small coordinated updates.

Copilot CLI has been helpful for:

* exploring the repo and locating the exact files tied to a feature
* drafting and revising content directly in the existing site structure
* making surgical updates across related Astro files
* validating assumptions quickly from the terminal while the migration is in motion

The biggest value has been keeping the feedback loop tight. Instead of bouncing between a browser, documentation, and a pile of manual notes, we can stay close to the code and the content while working through the migration.

## Where OpenSpec has helped

OpenSpec has been just as useful, but in a different way.

When you are migrating a site, the hard part is not always writing the code. Often the hard part is being disciplined about the scope of each change, documenting what you intend to do, and keeping a record of the decisions you made along the way. That is where OpenSpec has fit nicely into this effort.

We have been using OpenSpec to:

* define focused change proposals before implementation
* capture design intent for UI updates
* break larger work into concrete task lists
* keep an audit trail of what changed and why

That structure has been especially helpful for frontend work where a change can look small from the outside but still touch multiple files, behaviors, and accessibility concerns underneath.

## What has been done so far

At the time of writing, the migration is already far enough along that the new Astro version is not just an idea. The repository now contains a working Astro site, and we have already been iterating on pieces such as navigation and search. Those are exactly the sorts of features that motivated the move in the first place, because they benefit from a more modern component-driven setup.

Just as important, the migration has reinforced that this should be treated as a process instead of a switch flip. Every feature we move over teaches us something about what still needs cleanup, what content needs adjustment, and where the old assumptions from the Pelican site no longer map cleanly to the new frontend.

## What is left

There is still work to do before the migration is complete. Some of the remaining effort is technical, and some of it is editorial.

We still need to keep refining content parity, verify old posts render the way we expect, continue smoothing out the new UI, and decide exactly when the Astro site is ready to fully replace the Pelican version. We also want to make sure the final result is not just newer, but actually better to maintain.

## Final thoughts for now

This post is intentionally a snapshot rather than a conclusion. Pelican got us a long way, and Astro is helping us take the next step without giving up the strengths of a static site. Using Copilot CLI has made it easier to work directly in the repo and move quickly, while OpenSpec has helped keep the migration organized and intentional.

Once the cutover is complete, we will come back and turn this draft into a fuller retrospective with the parts that only become clear at the end of a migration: what worked, what was unexpectedly painful, and what we would do differently next time.
