# Repository guidelines

- Keep changes focused and consistent with the existing TypeScript style. Edit source in `src/`, not generated files in `dist/`.
- Preserve the public API and token semantics unless a breaking change is explicitly requested.
- Add or update tests in `test/` for behavior changes. Run `npm test` before finishing.
- Keep the API reference in `docs/api.md` up to date; avoid duplicating it in the READMEs.
- Record user-facing changes under `[Unreleased]` in `CHANGELOG.md`.
- Only commit, push, or publish when requested. For releases, use `bun run pub patch` and verify with `bun run pub-check --wait 120`.
