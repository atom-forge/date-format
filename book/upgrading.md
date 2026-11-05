---
title: Upgrading
type: chapter
requires: [dateFormat-api, format-tokens]
teaches: [upgrading]
---
# Upgrading

This chapter lists the changes that may require action when you upgrade. Each version section covers the step from the previous published version; read every section between your current and your target version. Changes that need no action, such as new features and internal improvements, are listed only in the changelog.

## From 0.1.5 to 0.1.6

### Invalid and `null` dates throw

`dateFormat` now validates the `date` argument itself before formatting.

| Input | 0.1.5 | 0.1.6 |
| --- | --- | --- |
| `null` | Formatted the Unix epoch, e.g. `"1970"` for `%Y` | Throws `TypeError` |
| Invalid date, e.g. `"nonsense"` or `new Date(NaN)` | `RangeError: Invalid time value` from `Intl` | `RangeError: dateFormat: invalid date: nonsense` |
| Template without tokens and an invalid date | Returned the template unchanged | Throws `RangeError` |

**What to do:** Do not pass `null` where "no date" is possible; pass `undefined` for the current time or skip formatting. If you match on the error message, match on `RangeError` instead of the text `Invalid time value`.

### `%L`, `%z`, `%%` and `$$` are now recognized

`%L` (milliseconds) and `%z` (UTC offset) are new tokens, and doubled prefixes now escape a literal `%` or `$`. Templates that contained these sequences as literal text produce different output.

| Template | 0.1.5 | 0.1.6 |
| --- | --- | --- |
| `"%Y%%"` | `"2024%%"` | `"2024%"` |
| `"%%Y"` | `"%2024"` | `"%Y"` |
| `"$$M"` | `"$December"` | `"$M"` |
| `"%H:%I %z"` (UTC) | `"14:05 %z"` | `"14:05 +00:00"` |

**What to do:** Search your templates for `%%`, `$$`, `%L` and `%z`. Where a literal `%` or `$` should appear, double it; where a token should follow a literal prefix character, write the prefix doubled followed by the token, e.g. `"$$$M"` for `"$December"`.

### Month names next to a day of month use the contextual form

When the template contains `%d` or `%D`, `$M` and `$m` now use the locale's contextual month form instead of the standalone one. English, Hungarian, German and French output is unchanged; inflecting languages now get the grammatically correct case.

| Template and locale | 0.1.5 | 0.1.6 |
| --- | --- | --- |
| `"%d $M %Y"`, `ru-RU` | `"24 декабрь 2024"` | `"24 декабря 2024"` |
| `"%d $M"`, `pl-PL` | `"24 grudzień"` | `"24 grudnia"` |
| `"%d $M"`, `fi-FI` | `"24 joulukuu"` | `"24 joulukuuta"` |
| `"%d $M"`, `ca-ES` | `"24 desembre"` | `"24 de desembre"` |
| `"$M %Y"`, `ru-RU` | `"декабрь 2024"` | `"декабрь 2024"` (no day, unchanged) |

**What to do:** If you worked around the wrong case, remove the workaround. Check templates for locales whose contextual form contains a particle: a Catalan template written as `"%d de $M"` now renders `"24 de de desembre"`; write `"%d $M"` instead. Update test snapshots that contain month names next to a day.

Return to [[book|the book overview]].
