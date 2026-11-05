# API reference: @atom-forge/date-format

The shared API reference for users and coding assistants. See [README.md](../README.md) for installation.

The package exports one function, `dateFormat`, as an ESM named export and includes TypeScript declarations. Formatting in a timezone changes the displayed fields of an existing instant; it does not mutate the input date.

## Public API

```ts
import { dateFormat } from "@atom-forge/date-format";

function dateFormat(
  format: string,
  date?: Date | string | number,
  lang?: string,
  timeZone?: string,
): string;
```

- `format`: a template containing the package's case-sensitive tokens and literal text.
- `date`: defaults to the current time. Strings and numeric timestamps (epoch milliseconds) are passed to `new Date(date)`; there is no custom parser. An invalid date throws a `RangeError`; `null` throws a `TypeError`.
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

| Field | Lowercase token | Uppercase token |
| --- | --- | --- |
| Year | `%y` (two-digit year) | `%Y` (full year) |
| Numeric month | `%m` | `%M` |
| Day of month | `%d` | `%D` |
| 24-hour clock | `%h` | `%H` |
| 12-hour clock | `%g` | `%G` |
| Minute | `%i` | `%I` |
| Second | `%s` | `%S` |
| Milliseconds | — | `%L` (three digits) |
| Month name | `$m` (short) | `$M` (long) |
| Weekday name | `$w` (short), `$d` (narrow) | `$D` or `$W` (long) |
| Day period | `$p` (always `am` / `pm`) | `$P` (localized long day period) |
| Timezone name | `$z` (short) | `$Z` (long) |
| UTC offset | `%z` (`+01:00`, `+00:00` for UTC) | — |
| Literal `%` / `$` | `%%` / `$$` | |

In particular, **`%M` is the month, not the minute**; use `%I` for two-digit minutes. `%D` is the day of the month, while `$D` is the weekday name. For numeric month/day/hour/minute/second the lowercase token is unpadded and the uppercase token is two-digit; for the year, `%Y` is the full year and `%y` the two-digit year.

Recognized tokens are replaced wherever they appear, including repeated occurrences. Other text remains unchanged. To output a literal `%` or `$`, double it: `dateFormat("50%%off %d")` gives `"50%off 24"`, and `%%Y` gives `%Y`. Quotes do not escape tokens. Unsupported patterns such as `YYYY-MM-DD` remain literal text.

`%z` and `$p` are locale-independent and always use ASCII characters, so `"%Y-%M-%DT%H:%I:%S%z"` with an ASCII-digit locale produces an ISO 8601 timestamp in the requested timezone.

## Runtime and correctness considerations

- Prefer `Date` instances or ISO strings with an explicit offset (`Z` or `+01:00`) for instants. Parsing ambiguous strings follows JavaScript's `Date` behavior, not the requested locale.
- Date-only strings and date-times without offsets have different JavaScript parsing semantics. A date-only ISO string is interpreted as UTC and may display on the previous day in another timezone. This package does not model timezone-free calendar dates.
- Locale controls localized names, digits, and calendar behavior; the template still controls field order and separators. Do not assume every locale yields ASCII digits or Gregorian years. For calendars without a numeric year (e.g. `-u-ca-chinese`), `%Y` falls back to the related Gregorian year. `%Y` is not zero-padded (year 33 renders as `33`) and has no era marker.
- When the template contains a day of month (`%d` or `%D`), `$M` and `$m` use the locale's contextual month form, which differs in inflecting languages (Russian `24 декабря`, Polish `24 grudnia` instead of the standalone `декабрь`, `grudzień`). Some locales include a particle in this form (Catalan `de desembre`). If a locale only offers a numeric month in that context, the standalone name is used.
- Localized text retains punctuation. Timezone names depend on locale, runtime internationalization data, and daylight saving time; they may be offsets such as `GMT+2` rather than abbreviations.
- Invalid dates throw a `RangeError` from the function itself; invalid locales or timezone identifiers make the underlying Intl APIs throw. The function does not provide a fallback. Validate untrusted inputs separately.
- The runtime must support `Intl.DateTimeFormat`, `formatToParts`, and the requested locale/timezone data. Formatters are cached internally; callers do not need to manage them.
- In tests, specify the date, locale, and timezone rather than depending on the current time or machine timezone. Avoid portable assertions that require a particular timezone-name spelling.

## Documentation maintenance

Update this reference whenever public API or token semantics change. README.md and README-AI.md link here rather than maintaining separate API references.
