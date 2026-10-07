# AI README: @atom-forge/date-format

## What this package is

A lightweight, dependency-free-at-runtime JavaScript/TypeScript date formatter built on `Intl.DateTimeFormat`. It provides the ESM named export `dateFormat` and TypeScript declarations.

## When to use it

Choose this package to render dates and times with an explicit template, localized month/weekday names, and an optional timezone. Typical uses are UI labels, report dates, and strings whose field order and separators are controlled by the application.

Do not use it for custom date parsing, input validation, date arithmetic, durations, relative time, comparisons, or scheduling. It does not convert a local wall-clock time into an instant in a named timezone. Use `Date.prototype.toISOString()` for ISO timestamp serialization, or `Intl.DateTimeFormat` directly when the locale should choose the layout.

## Read before generating code

Read the shared [API reference](./docs/api.md) for the signature, defaults, examples, complete token reference, and runtime caveats. Tokens are package-specific, not Moment/date-fns/strftime-compatible. For reproducible output, supply an explicit date, locale, and timezone.

See [README.md](./README.md) for installation.

## If modifying this repository

Follow the repository's `AGENTS.md` for contribution rules.
