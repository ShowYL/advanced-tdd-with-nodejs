# Code Style

TL;DR
- Strict TypeScript, small pure functions, immutable domain objects.
- Named exports only; no default exports.
- 2 spaces, single quotes, semicolons, max line length ~100.
- Descriptive errors (Error subclasses), no magic strings/numbers.

TypeScript
- Enable strict typing; avoid implicit any.
- Prefer readonly where possible.
- Use union/enum types for finite states; avoid stringly-typed APIs.
- Interfaces for public contracts; type aliases for unions and utility compositions.
- Narrow types at boundaries and validate inputs early.

Modules and exports
- Use named exports; avoid default exports to simplify refactors and tooling.
- Keep files focused: one main concept per file.

Immutability and functions
- Domain objects are immutable; methods return new instances rather than mutating.
- Functions should be small, composable, and side-effect-free unless clearly marked as adapters.

Naming
- Files: kebab-case (e.g., user-name.ts).
- Classes/Types/Enums: PascalCase. Variables/functions: camelCase. Constants: UPPER_SNAKE_CASE.
- Be explicit and intention-revealing; avoid abbreviations.

Errors and validation
- Throw Error subclasses with descriptive messages. Never throw raw strings.
- Validate at construction time for value objects and entities; fail fast.

Imports
- Prefer absolute or alias-based imports within the project to reduce brittle relative paths.
- Keep imports sorted by source (std libs, third-party, internal) and then alphabetically.

Dates and serialization
- Use Date objects for timestamps; serialize with toISOString.
- Keep serialization in domain serializers or toJSON methods returning primitives.

Comments and docs
- JSDoc for public APIs and non-trivial logic.
- Avoid commented-out code. Use TODO/FIXME with context and owner if necessary.

Formatting and linting
- Consistent formatting: 2-space indent, single quotes, semicolons.
- If using ESLint/Prettier, prefer recommended configs; otherwise adhere to this guide.

Commit style
- Prefer Conventional Commits (feat:, fix:, docs:, refactor:, test:, chore:).
- Keep commits small, focused, and with passing tests.
