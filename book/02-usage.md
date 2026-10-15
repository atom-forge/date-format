---
title: Installation and API
type: chapter
requires: [formatting-model]
teaches: [dateFormat-api]
---
# Installation and API

## Install

Choose the command for your package manager:

```sh
npm install @atom-forge/date-format
```

```sh
bun add @atom-forge/date-format
```

## First example

```ts
import { dateFormat } from "@atom-forge/date-format";

const instant = new Date("2024-12-24T14:05:03Z");

const label = dateFormat("%Y-%M-%D %H:%I", instant, "en-GB", "UTC");
// "2024-12-24 14:05"
```

## Signature

```ts
function dateFormat(
  format: string,
  date?: Date | string,
  lang?: string,
  timeZone?: string,
): string;
```

| Parameter | Meaning | Default |
| --- | --- | --- |
| `format` | Case-sensitive tokens and literal text | Required |
| `date` | A `Date` instance or a string parsed by `new Date` | Current time |
| `lang` | Locale used by the internationalization APIs | `"en-GB"` |
| `timeZone` | Timezone identifier, such as `"UTC"` or `"Europe/Budapest"` | Runtime's default timezone |

The return value is a string. There is no options object or additional configuration API.

## Input variants

A string with an explicit offset identifies an instant:

```ts
dateFormat("%H:%I", "2024-12-24T14:05:03Z", "en-GB", "UTC");
// "14:05"
```

Numeric timestamps are not accepted by the TypeScript API. Wrap epoch milliseconds in a `Date`:

```ts
const timestamp = Date.parse("2024-12-24T14:05:03Z");
dateFormat("%Y-%M-%D", new Date(timestamp), "en-GB", "UTC");
// "2024-12-24"
```

To use the current time while specifying a locale or timezone, pass `undefined` for the date:

```ts
dateFormat("%Y-%M-%D", undefined, "en-GB", "Europe/Budapest");
```

> [!warning] Defaults are environment-dependent
> Omitting the date uses the current time. Omitting the timezone uses the runtime's timezone, not necessarily UTC. Supply both explicitly in tests and whenever output must be consistent across machines.

> [!note] Runtime requirements
> The runtime must support `Intl.DateTimeFormat`, `formatToParts`, and the locale/timezone data you need. The package also uses `Intl.NumberFormat` for localized numeric padding.

Continue with [[03-tokens|Tokens and templates]].
