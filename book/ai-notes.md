# AI Notes

A coding agent works best when it reads the documentation of the package first and knows the decisions your project has already made. Copy the fenced block below into the instruction file of your project (for example `AGENTS.md`) and replace every `<...>` field with a fact you have verified in your application.

## Purpose

Keep date presentation consistent with explicit format, locale, and timezone
choices.

## Copyable instructions

```markdown
## AtomForge Date Format

Before using `@atom-forge/date-format`, start with
`node_modules/@atom-forge/date-format/README-AI.md` at the package root, then follow
its documentation pointers. Follow dependency symlinks to the library repository
when present and use documentation matching the installed version. This is a
filesystem Markdown path, not a package import subpath.

Use `dateFormat(format, date, lang, timeZone)` for presentation, not date
arithmetic or parsing arbitrary user input. Validate incoming dates separately;
use an unambiguous timestamp with an offset when representing an instant.

Reuse the application's established display formats, locale, and timezone
policy instead of inventing them at each call site. For server-rendered UI, use
consistent locale and timezone choices on the server and client.

Use this package's tokens, not patterns copied from another date library:
`%Y-%M-%D` formats a numeric date and `%H:%I:%S` formats time. `%M` is the padded
month; `%I` is the padded minute. Keep formatted strings at the presentation
boundary rather than storing them as source date values.
```

## Usage

Copy the block when implementing date display. Choose actual formats, locale,
and timezone according to the target application's requirements.
