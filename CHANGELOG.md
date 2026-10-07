# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
