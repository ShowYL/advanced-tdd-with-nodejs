# Contributing

Thank you for contributing! Please read these documents first:
- AI_GUIDE.md — guidance for AI-assisted changes
- ARCHITECTURE.md — project structure and boundaries
- CODE_STYLE.md — TypeScript conventions
- TESTING_GUIDE.md — unit vs integration testing
- PROMPT_SNIPPETS.md — reusable task templates

Workflow
1) Discuss significant changes via issue or draft PR.
2) Write or update tests first (TDD), then implementation.
3) Keep changes small and focused; prefer incremental PRs.

Local checks
- Install dependencies and run:
  - npm run build (or TypeScript compile)
  - npm test
- Ensure no type errors and tests are green before pushing.

Commit messages
- Prefer Conventional Commits: feat:, fix:, docs:, refactor:, test:, chore:.
- Keep the subject line concise; include context in the body if needed.

Pull request checklist
- Linked issue (if applicable) and clear description of the change.
- References to the sections from the guidelines you followed.
- Unit tests for domain changes; integration tests for infra/boundaries.
- No secrets in code; configuration via environment variables.
- Adheres to CODE_STYLE.md; public APIs preserved unless explicitly changed.
- Migration notes included if any breaking change is unavoidable.

AI-assisted changes
- Include the prompt/task used and summarize the plan/files modified.
- Ensure patches are minimal, with exact Before/After matches where required by tools.
- If the task was ambiguous, document the assumptions made.

Code of Conduct
- Be respectful, constructive, and collaborative. Review others’ work in kind.
