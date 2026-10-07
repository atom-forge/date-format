# @atom-forge/date-format

Lightweight, token-based date formatting utility built on `Intl.DateTimeFormat`.

For coding assistants, see [README-AI.md](./README-AI.md) for when to use
this package, API guidance, and common pitfalls.

## Installation

```bash
bun add @atom-forge/date-format
```

## Quick start

```ts
import { dateFormat } from "@atom-forge/date-format";

const date = new Date("2024-12-24T14:05:03Z");
dateFormat("%Y-%M-%D %H:%I", date, "en-GB", "UTC");
// "2024-12-24 14:05"
```

## Documentation

See the shared [API reference](./docs/api.md) for the function signature,
defaults, examples, complete token reference, and date/locale/timezone caveats.
