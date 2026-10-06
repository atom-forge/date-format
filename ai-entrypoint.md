# AI entrypoint: @atom-forge/date-format

This document gives coding assistants the context needed to choose and use this package correctly. See [README.md](./README.md) for installation, the complete token reference, and development/release instructions. The public implementation is in [src/index.ts](./src/index.ts).

## When to use this package

Use `@atom-forge/date-format` when a JavaScript or TypeScript application needs to render a date or time using an explicit template, with localized month/weekday names and an optional timezone. Typical uses include UI labels, report dates, and date/time strings whose field order and separators must be controlled by the application.

The package is a lightweight, dependency-free-at-runtime formatter built on `Intl.DateTimeFormat`. It exports one function, `dateFormat`, as an ESM named export and includes TypeScript declarations.

Do not use it for:

- Parsing a string according to a custom date pattern or validating user input.
- Date arithmetic, durations, relative time, date comparisons, or scheduling.
- Converting a local wall-clock time into an instant in a named timezone.
- ISO timestamp serialization: use `Date.prototype.toISOString()` when that is the requirement.
- Automatically choosing a locale's conventional date layout: use `Intl.DateTimeFormat` directly when no explicit template is needed.

Formatting in a timezone changes the displayed fields of an existing instant; it does not mutate the input date.

## Public API

```ts
import { dateFormat } from "@atom-forge/date-format";

function dateFormat(
  format: string,
  date?: Date | string,
  lang?: string,
  timeZone?: string,
): string;
```

- `format`: a template containing the package's case-sensitive tokens and literal text.
- `date`: defaults to the current time. Strings are passed to `new Date(date)`; there is no custom parser. Numeric timestamps are not accepted by the public TypeScript API; wrap them in `new Date(timestamp)`.
- `lang`: defaults to `"en-GB"`; passed to the platform's internationalization APIs.
- `timeZone`: optional timezone identifier, for example `"Europe/Budapest"` or `"UTC"`. If omitted, the runtime's default timezone is used, not necessarily UTC.

To supply a locale or timezone while using the current time, pass `undefined` for `date`.

## Examples

Use an explicit instant and timezone when the output must be reproducible:

```ts
const instant = new Date("2024-12-24T14:05:03Z");

dateFormat("%Y-%M-%D", instant, "en-GB", "UTC");
// "2024-12-24"

dateFormat("$M %d, %Y", instant, "en-GB", "UTC");
// "December 24, 2024"

dateFormat("%H:%I:%S", instant, "en-GB", "Europe/Budapest");
// "15:05:03"

dateFormat("%g:%I $p", instant, "en-GB", "UTC");
// "2:05 pm"

dateFormat("%Y. $M %d.", instant, "hu-HU", "Europe/Budapest");
// "2024. december 24."

// Current date in a specified timezone:
dateFormat("%Y-%M-%D", undefined, "en-GB", "Europe/Budapest");
```

## Token rules and common mistakes

These are package-specific tokens, not Moment/date-fns patterns or standard `strftime`. Do not copy a pattern from another library without translating it.

| Field | Unpadded / short | Padded / long |
| --- | --- | --- |
| Year | `%Y` (full year) | `%y` (two-digit year) |
| Numeric month | `%m` | `%M` |
| Day of month | `%d` | `%D` |
| 24-hour clock | `%h` | `%H` |
| 12-hour clock | `%g` | `%G` |
| Minute | `%i` | `%I` |
| Second | `%s` | `%S` |
| Month name | `$m` (short) | `$M` (long) |
| Weekday name | `$w` (short), `$d` (narrow) | `$D` or `$W` (long) |
| Day period | `$p` (always `am` / `pm`) | `$P` (localized long day period) |
| Timezone name | `$z` (short) | `$Z` (long) |

In particular, **`%M` is the month, not the minute**; use `%I` for two-digit minutes. `%D` is the day of the month, while `$D` is the weekday name. Uppercase padding applies to numeric month/day/hour/minute/second tokens; the year tokens have their own meanings.

Recognized tokens are replaced wherever they appear, including repeated occurrences. Other text remains unchanged. There is no dedicated token-escaping syntax; do not assume quotes or doubled `%` / `$` characters escape recognized tokens. Unsupported patterns such as `YYYY-MM-DD` remain literal text.

## Runtime and correctness considerations

- Prefer `Date` instances or ISO strings with an explicit offset (`Z` or `+01:00`) for instants. Parsing ambiguous strings follows JavaScript's `Date` behavior, not the requested locale.
- Date-only strings and date-times without offsets have different JavaScript parsing semantics. A date-only ISO string is interpreted as UTC and may display on the previous day in another timezone. This package does not model timezone-free calendar dates.
- Locale controls localized names, digits, and calendar behavior; the template still controls field order and separators. Do not assume every locale yields ASCII digits or Gregorian years.
- Localized text retains punctuation. Timezone names depend on locale, runtime internationalization data, and daylight saving time; they may be offsets such as `GMT+2` rather than abbreviations.
- Invalid dates, locales, or timezone identifiers can cause the underlying JavaScript/Intl APIs to throw. The function does not catch errors or provide a fallback. Validate untrusted inputs separately.
- The runtime must support `Intl.DateTimeFormat`, `formatToParts`, and the requested locale/timezone data. Formatters are cached internally; callers do not need to manage them.
- In tests, specify the date, locale, and timezone rather than depending on the current time or machine timezone. Avoid portable assertions that require a particular timezone-name spelling.

## If modifying this repository

Keep changes focused on the formatting API and preserve existing token semantics unless a breaking change is explicitly requested. Consult the README for the development and release workflow. Run `npm test` to build the TypeScript source and execute the Node test suite. Keep this guide and the README token reference aligned with any public API changes.
