---
title: Tokens and templates
type: chapter
requires: [dateFormat-api]
teaches: [format-tokens]
---
# Tokens and templates

Templates consist of recognized, case-sensitive tokens and literal text. Numeric fields use `%`; localized text fields use `$`.

## Numeric tokens

The examples below use `en-GB` digits.

| Token | Meaning | Example |
| --- | --- | --- |
| `%Y` | Full year | `2024` |
| `%y` | Two-digit year | `24` |
| `%m` | Unpadded month | `4` |
| `%M` | Two-digit month | `04` |
| `%d` | Unpadded day of month | `7` |
| `%D` | Two-digit day of month | `07` |
| `%h` | Unpadded 24-hour clock hour | `9` |
| `%H` | Two-digit 24-hour clock hour | `09` |
| `%g` | Unpadded 12-hour clock hour | `2` |
| `%G` | Two-digit 12-hour clock hour | `02` |
| `%i` | Unpadded minute | `5` |
| `%I` | Two-digit minute | `05` |
| `%s` | Unpadded second | `3` |
| `%S` | Two-digit second | `03` |

Uppercase month, day, hour, minute, and second tokens use two digits. Year tokens are the exception: `%Y` is the full year and `%y` is the two-digit year. The 24-hour tokens use the 00–23 cycle; 12-hour tokens use 1–12 before padding.

> [!warning] Month is not minute
> `%M` means two-digit **month**. Use `%I` for two-digit **minutes**. These are package-specific tokens, not Moment, date-fns, or standard `strftime` patterns.

## Text tokens

| Token | Meaning | Illustrative English output |
| --- | --- | --- |
| `$m` | Short month name | `Dec` |
| `$M` | Long month name | `December` |
| `$d` | Narrow weekday | `T` |
| `$w` | Short weekday | `Tue` |
| `$D` | Long weekday | `Tuesday` |
| `$W` | Long weekday, alias of `$D` | `Tuesday` |
| `$p` | Conventional AM/PM marker | `am` or `pm` |
| `$P` | Localized long day period | `in the afternoon` |
| `$z` | Short timezone name | `UTC` or an offset such as `GMT+1` |
| `$Z` | Long timezone name | `Coordinated Universal Time` |

Text depends on locale and runtime internationalization data. Punctuation in localized names is preserved. `$p` always uses lowercase `am` or `pm`, independently of the chosen locale; `$P` is localized.

> [!note] Similar names, different fields
> `%D` is the day of the month, while `$D` is the weekday name. A narrow weekday such as `$d` is compact but may not uniquely identify a weekday.

## Combining tokens

```ts
import { dateFormat } from "@atom-forge/date-format";

const instant = new Date("2024-12-24T14:05:03Z");

dateFormat("$D, $M %d, %Y", instant, "en-GB", "UTC");
// "Tuesday, December 24, 2024"

dateFormat("%g:%I $p", instant, "en-GB", "UTC");
// "2:05 pm"

dateFormat("%Y/%Y", instant, "en-GB", "UTC");
// "2024/2024"
```

## Literals and unsupported patterns

Recognized tokens are replaced wherever they occur, including repeated occurrences. Unrecognized text stays unchanged:

```ts
dateFormat("YYYY-MM-DD", instant, "en-GB", "UTC");
// "YYYY-MM-DD"
```

There is no dedicated token-escaping syntax. Quoting a token or doubling a prefix does not prevent recognized tokens from being replaced.

> [!tip] Translate patterns explicitly
> When migrating from another library, translate each field using this table instead of copying the old template. Unsupported patterns are not rejected; they remain literal text.

Continue with [[04-locales-and-timezones|Locales and timezones]].
