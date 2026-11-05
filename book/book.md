---
title: Date Format
subtitle: "@atom-forge/date-format"
author: AtomForge
language: en
id: atom-forge-date-format
intro: A practical guide to token-based date formatting, localization, and reliable timezone handling.
tags: [typescript, javascript, intl, date-format]
children:
  - "[[overview.md]]"
  - "[[usage.md]]"
  - "[[tokens.md]]"
  - "[[locales-and-timezones.md]]"
  - "[[recipes-and-testing.md]]"
  - "[[upgrading.md]]"
  - "[AI Notes](ai-notes.md)"
---
# Date formatting with @atom-forge/date-format

`@atom-forge/date-format` is a lightweight JavaScript/TypeScript date formatter built on `Intl.DateTimeFormat`. Templates control field order and separators; the locale and timezone control the displayed values.

This book takes you from choosing the package to writing predictable templates and handling localization and timezones safely.

> [!abstract] What you will learn
> When to choose this package, how to call `dateFormat`, what each token means, and how to avoid surprises caused by date parsing and runtime timezone defaults.

## Reading path

- [[overview|Overview]] — purpose, scope, and how formatting works.
- [[usage|Installation and API]] — your first call and the four parameters.
- [[tokens|Tokens and templates]] — the complete token reference.
- [[locales-and-timezones|Locales and timezones]] — displaying the same instant in different contexts.
- [[recipes-and-testing|Recipes and testing]] — practical patterns, validation, and reproducible tests.
- [[upgrading|Upgrading]] — changes that need action when you move to a newer version.

> [!note] Predictable examples
> Examples generally use an explicit instant and timezone rather than the current time or your machine's timezone. Localized wording still depends on the runtime's internationalization data.
