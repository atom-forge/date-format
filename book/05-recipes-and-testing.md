---
title: Recipes and testing
type: chapter
requires: [format-tokens, timezone-display, date-parsing]
teaches: [input-validation, reproducible-tests]
---
# Recipes and testing

## Display a report timestamp

Use an explicit locale and timezone for reports that must be consistent across environments:

```ts
import { dateFormat } from "@atom-forge/date-format";

const instant = new Date("2024-12-24T14:05:03Z");
const timestamp = dateFormat("%Y-%M-%D %H:%I:%S", instant, "en-GB", "UTC");
// "2024-12-24 14:05:03"
```

> [!warning] This is a display string, not ISO serialization
> A template can look like a timestamp without being a portable serialization format. For an ISO representation of the instant, use `instant.toISOString()`.

## Centralize your UI defaults

An application-level wrapper keeps locale and timezone decisions in one place:

```ts
import { dateFormat } from "@atom-forge/date-format";

function formatEventDate(date: Date | string): string {
  return dateFormat("$M %d, %Y — %H:%I", date, "en-GB", "Europe/Budapest");
}

formatEventDate("2024-12-24T14:05:03Z");
// "December 24, 2024 — 15:05"
```

If users have preferences, pass their locale and timezone through your application wrapper instead of relying on the server's defaults.

## Validate external input

Invalid dates, locale syntax, or timezone identifiers can cause the underlying APIs to throw. The package does not catch these errors or supply a fallback.

```ts
import { dateFormat } from "@atom-forge/date-format";

function formatExternalTimestamp(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Expected a valid timestamp");
  }

  return dateFormat("%Y-%M-%D %H:%I", date, "en-GB", "UTC");
}
```

> [!note] Valid does not mean unambiguous
> Checking `getTime()` only detects an invalid JavaScript date. It does not enforce a strict input format or detect every normalized calendar value. Validate your input contract separately; prefer explicit offsets for instants.

Avoid depending on token-free templates to validate dates or configuration: when no recognized token is present, no date formatting is performed.

## Write reproducible tests

Use a fixed input date, locale, and timezone. The following test uses Node's built-in test runner:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { dateFormat } from "@atom-forge/date-format";

test("formats a timestamp in UTC", () => {
  assert.equal(
    dateFormat("%Y-%M-%D %H:%I:%S", "2024-12-24T14:05:03Z", "en-GB", "UTC"),
    "2024-12-24 14:05:03",
  );
});

test("formats the same instant in Budapest", () => {
  assert.equal(
    dateFormat("%H:%I", "2024-12-24T14:05:03Z", "en-GB", "Europe/Budapest"),
    "15:05",
  );
});
```

> [!tip] Test the behavior you depend on
> Cover numeric padding, midnight, date boundaries, and daylight saving transitions if they matter to your application. Avoid cross-runtime assertions that require one particular spelling of a timezone name or localized day period.

## Troubleshooting checklist

| Symptom | Check |
| --- | --- |
| Template appears unchanged | Are you using this package's tokens rather than `YYYY`, `MM`, or `DD`? |
| Month appears where minutes should be | Replace `%M` with `%I` in the time field. |
| Date differs between server and browser | Supply an explicit timezone and inspect the input offset. |
| Date-only value moves to the previous day | Check whether UTC midnight is being displayed in another timezone. |
| Text differs across machines | Check locale support and internationalization data. |
| Formatting throws | Validate the date and inspect locale/timezone arguments. |

Return to [[book|the book overview]] or revisit [[03-tokens|the token reference]].
