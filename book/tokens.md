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
| `%L` | Three-digit milliseconds | `007` |
| `%z` | UTC offset, locale-independent | `+01:00` |

Uppercase month, day, hour, minute, and second tokens use two digits. Year tokens are the exception: `%Y` is the full year and `%y` is the two-digit year. `%Y` is not zero-padded (year 33 renders as `33`) and has no era marker. The 24-hour tokens use the 00–23 cycle; 12-hour tokens use 1–12 before padding.

`%z` always uses ASCII characters, independently of the locale: `+01:00`, `-05:00`, or `+00:00` for UTC.

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

Text depends on locale and runtime internationalization data. When the template also contains `%d` or `%D`, month names use the locale's contextual form, so inflecting languages get the correct case (Russian `24 декабря`, not `24 декабрь`). Punctuation in localized names is preserved. `$p` always uses lowercase `am` or `pm`, independently of the chosen locale; `$P` is localized.

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

dateFormat("%Y-%M-%DT%H:%I:%S%z", instant, "en-GB", "Europe/Budapest");
// "2024-12-24T15:05:03+01:00"
```

## Literals and unsupported patterns

Recognized tokens are replaced wherever they occur, including repeated occurrences. Unrecognized text stays unchanged:

```ts
dateFormat("YYYY-MM-DD", instant, "en-GB", "UTC");
// "YYYY-MM-DD"
```

To output a literal `%` or `$`, double it. Quoting a token does not escape it:

```ts
dateFormat("50%%off on %d $$M", instant, "en-GB", "UTC");
// "50%off on 24 $M"
```

> [!tip] Translate patterns explicitly
> When migrating from another library, translate each field using this table instead of copying the old template. Unsupported patterns are not rejected; they remain literal text.

Continue with [[locales-and-timezones|Locales and timezones]].
