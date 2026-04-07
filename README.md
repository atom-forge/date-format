# @atom-forge/date-format

Lightweight, token-based date formatting utility built on `Intl.DateTimeFormat`.

## Installation

```bash
bun add @atom-forge/date-format
```

## Usage

```ts
import { dateFormat } from "@atom-forge/date-format";

dateFormat("%Y-%M-%D")               // "2026-04-07"
dateFormat("$M %D, %Y")             // "April 07, 2026"
dateFormat("%H:%I:%S")               // "14:05:03"
dateFormat("%D $M %Y", "2024-12-24") // "24 Dec 2024"
dateFormat("%Y", new Date(), "hu-HU") // "2026"
dateFormat("%H:%I", new Date(), "en-GB", "America/New_York") // "08:05"
```

## Signature

```ts
function dateFormat(
  format: string,
  date?: Date | string,   // default: now
  lang?: string,          // default: "en-GB"
  timeZone?: string       // optional, e.g. "Europe/Budapest"
): string
```

## Tokens

### Numeric

| Token | Description         | Example |
|-------|---------------------|---------|
| `%Y`  | Year, full          | `2026`  |
| `%y`  | Year, 2-digit       | `26`    |
| `%m`  | Month, numeric      | `4`     |
| `%M`  | Month, 2-digit      | `04`    |
| `%d`  | Day, numeric        | `7`     |
| `%D`  | Day, 2-digit        | `07`    |
| `%h`  | Hour, 24h numeric   | `9`     |
| `%H`  | Hour, 24h 2-digit   | `09`    |
| `%g`  | Hour, 12h numeric   | `9`     |
| `%G`  | Hour, 12h 2-digit   | `09`    |
| `%i`  | Minute, numeric     | `5`     |
| `%I`  | Minute, 2-digit     | `05`    |
| `%s`  | Second, numeric     | `3`     |
| `%S`  | Second, 2-digit     | `03`    |

### Text

| Token | Description        | Example                   |
|-------|--------------------|---------------------------|
| `$m`  | Month, short       | `Apr`                     |
| `$M`  | Month, long        | `April`                   |
| `$d`  | Weekday, narrow    | `T`                       |
| `$w`  | Weekday, short     | `Tue`                     |
| `$D`  | Weekday, long      | `Tuesday`                 |
| `$W`  | Weekday, long      | `Tuesday`                 |
| `$p`  | AM/PM, short       | `am`                      |
| `$P`  | AM/PM, long        | `in the morning`          |
| `$z`  | Timezone, short    | `CET`                     |
| `$Z`  | Timezone, long     | `Central European Time`   |
