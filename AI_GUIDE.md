# AI Guidance (LLM Constitution)

TL;DR
- Modify only files relevant to the task and preserve existing public APIs unless told otherwise.
- Prefer pure, strictly typed TypeScript; side effects belong in infrastructure adapters.
- Minimal prose; return clear code edits/paches. Use placeholders for secrets.
- Ask for confirmation when requirements are ambiguous or cross multiple boundaries.
- Ensure typecheck and tests pass after changes (or state what’s needed to make them pass).

Scope and boundaries
- Domain: src/domain/** (entities, value-objects, services). Pure, deterministic, no I/O.
- Infrastructure: src/infrastructure/** (adapters, repositories, external calls).
- Shared: src/shared/** (types/utilities safe across layers).
- Tests: tests/unit/** (pure, fast) and tests/integration/** (adapters/boundaries).

Response format
- Keep explanations brief; focus on code.
- Provide per-file patches or diffs (Before/After or unified diff). If the tool requires search-and-replace patches, make the “Before” unique and exact (including whitespace).
- Don’t include editor caret markers or non-textual data. Never include secrets.

Quality bars
- TypeScript: strict types, no implicit any, descriptive error messages.
- Domain code is immutable by default: methods return new instances rather than mutating.
- Validation and invariants live in value objects and entities; fail fast with clear errors.
- External effects only via explicit interfaces/ports; implement them in infrastructure.
- Serialization uses primitives (e.g., toJSON with strings/dates).

When to ask first
- The task spans multiple modules or changes public APIs.
- Missing or conflicting requirements.
- Large refactors that would invalidate tests or require staged PRs.

Security and safety
- No secrets in code or docs. Use placeholders like <API_KEY> and configuration via environment variables.
- Sanitize or stub network/filesystem usage in tests; prefer fakes for integration boundaries.

How LLMs can be most helpful
- Propose a short plan + list of files to change when scope isn’t obvious.
- Provide acceptance criteria and test updates alongside code changes.
- Keep changes minimal and reversible; prefer incremental steps.
