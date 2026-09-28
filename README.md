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
dateFormat("%D $M %Y", "2024-12-24") // "24 December 2024"
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

Numeric tokens without a leading capital letter are unpadded; their uppercase
variants use two digits. `$p` always returns `am` or `pm`, while `$P` returns a
localized day period. Localized text retains its punctuation. Timezone names
depend on the locale and runtime and may be offsets such as `GMT+2`.

## Development and release

```sh
bun install --frozen-lockfile
npm test
bun run pub --help
bun run pub patch --dry-run
bun run pub patch
bun run pub-check --wait 120
```

Releases use `@atom-forge/ship` through the `ship-it` command. Until Ship is
published to npm, its development dependency is `file:../ship`. Keep the Ship
repository checked out alongside this project; CI recreates that layout using
Ship commit `8410051f6bbcbafcc4826d3eeb78f1001e9aebdc`.

Since the Ship repository is private, set the date-format repository's Actions
secret `SHIP_READ_TOKEN` to a token with read access to `atom-forge/ship`
(Contents: read for a fine-grained GitHub token). This is for dependency checkout;
npm publishing itself uses OIDC. Once Ship is on npm, replace the local file
dependency with an exact npm version and remove the extra checkout and secret.

Write changes under `## [Unreleased]` in `CHANGELOG.md`, then commit and push
development changes before running a release. Ship requires a clean `main`
branch matching `origin/main`. Its configured verification runs the build and
tests, then inspects the npm package contents. `--dry-run` checks the release
preconditions without running verification commands or modifying files.

The release command updates the version and changelog, commits, tags, and
atomically pushes the release. The tag-triggered `publish.yml` installs locked
dependencies, validates the tag against the package/changelog, runs tests and
publishes using npm Trusted Publishing. The npm package must have a GitHub
Trusted Publisher configured for `atom-forge/date-format`, workflow
`publish.yml`, with direct `npm publish` allowed.
