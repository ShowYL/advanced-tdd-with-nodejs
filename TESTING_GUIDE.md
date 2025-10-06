# Testing Guide (Jest)

TL;DR
- Unit tests: fast, deterministic, no I/O, live in tests/unit/**.
- Integration tests: exercise adapters/boundaries, live in tests/integration/**.
- Use Arrange-Act-Assert (AAA), one behavior per test, clear names.
- Cover success, boundary, and failure. Prefer fakes over mocks.

Unit tests (tests/unit/**)
- Test public API of entities/value objects/services; avoid testing internals.
- Arrange-Act-Assert. One main expectation per test; related follow-ups allowed.
- Ensure determinism. Avoid timers and randomness; inject or fix inputs instead.
- Prefer custom builders/factories for setup to reduce duplication.

Integration tests (tests/integration/**)
- Validate real behavior of repositories/adapters against interfaces.
- Use real infrastructure where feasible (e.g., containers) or faithful fakes.
- Keep isolation: unique resources per test, clean up after.

Naming and structure
- Describe: suite per unit/feature. test/it: human-readable behavior statements.
- Example: "updateEmail() returns a new User with updated email and timestamp".
- Co-locate helpers/builders under tests/** if they are test-only.

Mocking policy
- Mock only external boundaries (network, filesystem, clock) or expensive resources.
- Prefer fakes/stubs over deep mocks. Keep assertions about observable behavior.
- Verify error paths: use toThrow/toThrowError with specific messages where appropriate.

Assertions and value objects
- Use value object equality methods when provided (e.g., equals) rather than deep equals.
- For timestamps, compare numeric getTime() or ISO strings.

Coverage and quality
- Keep meaningful coverage; avoid chasing 100% if it adds brittle tests.
- Always include boundary cases (min/max lengths, empty values, invalid formats).
- Avoid snapshot tests unless for stable, structured output.

Tooling
- Run tests with npm test.
- Use jest.useFakeTimers only when necessary and restore timers after the test.
- Use beforeAll/afterAll for expensive setup/teardown; prefer beforeEach/afterEach for isolation.

PR checklist for tests
- Tests fail without the change and pass with it.
- Clear names, minimal fixtures, no hidden dependencies.
- Unit tests for domain changes; integration tests when infra or boundaries change.
