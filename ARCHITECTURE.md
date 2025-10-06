# Architecture

TL;DR
- Domain is pure (no I/O), holds business rules: entities, value objects, services.
- Infrastructure implements side effects: repositories, external services, configuration.
- Shared contains cross-cutting types/utilities safe across layers.
- Tests are split: unit for domain, integration for infra/boundaries.
- Interactions happen via interfaces/ports defined in the domain; infra provides implementations.

Modules

Domain (src/domain/**)
- Entities: Aggregate roots and domain behavior. Identity-based equality (e.g., by id). Methods return new instances (immutability) and update timestamps appropriately.
- Value Objects: Small, immutable types enforcing invariants (e.g., Email, UserName). Creation via static factories (e.g., .create) with validation.
- Services: Pure business logic that doesn’t fit neatly into an entity or value object; may depend on domain-defined interfaces.

Repositories and Ports
- Define repository interfaces in the domain (ports).
- Concrete implementations live in infrastructure (adapters).
- Domain depends only on interfaces; infra depends on domain.

Infrastructure (src/infrastructure/**)
- Repositories: Implement domain repository interfaces using databases or storage.
- External Services: HTTP/SDK adapters that wrap third-party APIs.
- Config: Environment/configuration helpers injected into adapters.

Shared (src/shared/**)
- Types and utilities that are layer-safe (no business logic, no side effects).

Data flow and serialization
- Domain exposes methods that accept/return domain types (entities/VOs).
- Infra maps between persistence/transport formats (DTOs) and domain types at the edges.
- JSON serialization should output primitives; rehydrate via explicit factories in domain.

Testing strategy
- Unit tests (tests/unit/**): Fast, deterministic, no I/O. Focus on domain rules.
- Integration tests (tests/integration/**): Exercise adapters and boundaries (DB, HTTP, etc.) behind interfaces.

Extending the system (guidelines)
1) Start in the domain: define/extend value objects, entities, or interfaces.
2) Add or adjust tests (unit first), then infra adapters and integration tests as needed.
3) Keep boundaries strict: domain never imports infrastructure.
4) Prefer small, isolated changes with clear acceptance criteria and tests.
