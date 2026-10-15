---
title: Overview
type: chapter
teaches: [package-selection, formatting-model]
---
# Overview

## What the package does

Use `@atom-forge/date-format` to display a date or time with an explicit template. It is useful for UI labels, reports, and strings where your application chooses the order of fields and their separators while still needing localized month or weekday names.

The package has no runtime package dependencies. It provides one ESM named export, `dateFormat`, with TypeScript declarations.

## Choosing the right tool

| Requirement | Recommended tool |
| --- | --- |
| Explicit template with localized date fields | `dateFormat` |
| Locale-selected date layout | `Intl.DateTimeFormat` directly |
| ISO timestamp serialization | `Date.prototype.toISOString()` |
| Relative text such as “three minutes ago” | `Intl.RelativeTimeFormat` with application logic |
| Custom input parsing, date arithmetic, or scheduling | A separate solution appropriate to the task |

> [!warning] Formatting is not parsing
> A string input is passed to JavaScript's `Date` constructor. The format template describes the output, not the input. The package does not parse custom input patterns or validate form fields.

## How formatting works

```mermaid
flowchart TD
    A[Date or string input] --> B{Is the input a string?}
    B -->|Yes| C[Parse with the Date constructor]
    B -->|No| D[Use the Date instance]
    C --> E[Find recognized tokens in the template]
    D --> E
    E --> F[Format date parts with locale and timezone]
    F --> G[Normalize numeric padding and AM/PM]
    G --> H[Replace tokens and preserve literal text]
    H --> I[Return the display string]
```

Internally, the package extracts individual parts with `Intl.DateTimeFormat.formatToParts` and caches formatters by token, locale, and timezone. Callers do not need to manage these formatters.

Formatting does not mutate the input date. Supplying a timezone changes how an instant is displayed; it does not create a different instant.

> [!tip] Keep display and storage separate
> Store instants in a suitable timestamp representation and format them when displaying them. A formatted UI string is not a replacement for a timestamp.

Continue with [[02-usage|Installation and API]].
