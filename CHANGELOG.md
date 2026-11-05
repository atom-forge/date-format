# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Add an English BookMD documentation book covering package selection, API usage, tokens, locales, timezones and testing.
- Add `%L` (three-digit milliseconds) and `%z` (locale-independent UTC offset such as `+01:00`) tokens.
- Escape literal `%` and `$` by doubling them (`%%`, `$$`).
- Accept numeric timestamps (epoch milliseconds) as the date argument.

### Changed
- Throw a `RangeError` for invalid dates and a `TypeError` for `null` instead of failing inside Intl or silently formatting the epoch.
- Limit the internal formatter cache size.
- List the `types` export condition first and add a `default` condition; remove the legacy `release` script.

### Fixed
- Use the contextual month form next to a day of month, so inflecting languages render e.g. `24 декабря` instead of `24 декабрь`.
- Return the related Gregorian year for `%Y`/`%y` in calendars without a numeric year instead of an empty string.

## [0.1.5] - 2026-10-07

### Changed
- Consolidate the API reference in docs/api.md, linked from README.md and the concise README-AI.md.
- Rename ai-entrypoint.md to README-AI.md.
- Replace lengthy contribution documentation with concise repository rules in AGENTS.md.

## [0.1.4] - 2026-10-06

### Added
- Include an AI entrypoint guide with package selection guidance, API examples and formatting caveats.

### Changed
- Use the shared Ship CLI for release preparation, exact-version publication checks and CI tag validation.

### Fixed
- Extract individual Intl date parts so hour and timezone tokens contain only their requested values.
- Return conventional `am`/`pm` markers for `$p`, retaining localized day periods for `$P`.
- Normalize numeric token padding across locales and use 00–23 for 24-hour tokens.
- Preserve punctuation in localized text and correct the README long-month example.

---

## [0.1.3] - 2026-08-27

---

## [0.1.2] - 2026-06-01

- Initial changelog entry

---
