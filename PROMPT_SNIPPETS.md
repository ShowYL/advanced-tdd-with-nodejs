# Prompt Snippets (Reusable)

Value Object change
Objective:
- Add/adjust constraint X to value object Y.

Constraints:
- Only edit src/domain/value-objects/y.ts and related unit tests in tests/unit/**.
- Do not change public constructor signatures; add a static factory if needed.

Acceptance criteria:
- Violations throw descriptive errors.
- Boundaries covered (e.g., min/max, empty, invalid format).
- Existing tests remain green; new tests added for the change.

Output:
- Provide code edits for the domain file and unit tests.

Entity behavior
Objective:
- Add method/behavior B to entity E that updates fields and timestamps immutably.

Constraints:
- Only edit src/domain/entities/e.ts and add/adjust tests in tests/unit/**.
- Maintain immutability; return a new instance preserving identity.

Acceptance criteria:
- Old instance unchanged; new instance has updated fields and a newer updatedAt.
- Equality by identity remains correct.
- Tests cover success and error paths.

Repository method (port + adapter)
Objective:
- Introduce method M on repository R.

Constraints:
- Extend repository interface in src/domain/repositories/**.
- Implement in src/infrastructure/repositories/**.
- Add integration tests in tests/integration/**.

Acceptance criteria:
- Interface extended minimally and clearly.
- Integration test demonstrates behavior and error handling.

Adapter to external service
Objective:
- Add adapter A for external API S.

Constraints:
- Define a domain-facing interface (port) and infra implementation (adapter).
- Handle failures/timeouts; no secrets in code.

Acceptance criteria:
- Integration test stubs external service behavior.
- Domain remains free of external dependencies.

Bug fix
Objective:
- Fix bug D with minimal change.

Constraints:
- Modify only affected files; add regression tests.
- Keep public contracts stable unless justified.

Acceptance criteria:
- Failing test reproduces bug; passes after fix.
- No unintended behavior changes.

Refactor (safe)
Objective:
- Improve readability/structure without changing behavior.

Constraints:
- No public API changes; no cross-layer leaks.

Acceptance criteria:
- All tests remain green; complexity reduced; code conforms to CODE_STYLE.md.
