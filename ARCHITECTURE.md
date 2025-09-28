# Advanced TDD with Node.js: Clean Architecture & TestContainers

## Overview 2025

This document outlines the recommended architecture and testing stack for building a robust web API using Test-Driven Development (TDD) with clean architecture principles, dependency injection, and TestContainers for integration testing.

## Architecture Philosophy

### Clean Architecture / Hexagonal Pattern

The project follows the **Clean Architecture** (also known as **Hexagonal Architecture** or **Ports and Adapters**) pattern, which provides:

- **Independence**: Business logic is independent of frameworks, databases, and external services
- **Testability**: Each layer can be tested in isolation
- **Flexibility**: Easy to swap implementations without affecting business logic
- **Maintainability**: Clear separation of concerns and dependencies

### Dependency Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │───▶│   Application   │───▶│     Domain      │
│    (Controllers)│    │   (Use Cases)   │    │   (Entities)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       ▲
         ▼                       ▼                       │
┌─────────────────┐    ┌─────────────────┐               │
│ Infrastructure  │    │ Infrastructure  │───────────-───┘
│  (Web Server)   │    │ (Repositories)  │
└─────────────────┘    └─────────────────┘
```

## Recommended Technology Stack

### Core Framework Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Web Framework** | Fastify | High performance, excellent TypeScript support, built-in validation, plugin ecosystem |
| **Dependency Injection** | TSyringe | TypeScript-first, decorator-based, lightweight, Microsoft-backed |
| **Testing Framework** | Jest | Mature ecosystem, excellent TestContainers support, powerful mocking |
| **Integration Testing** | TestContainers | Real database/service testing, Docker-based isolation |
| **Database** | PostgreSQL | ACID compliance, excellent Node.js support, TestContainers compatibility |
| **ORM/Query Builder** | Prisma | Type-safe, excellent DX, migration support, clean architecture friendly |
| **Validation** | Zod | TypeScript-first, composable, runtime type checking |

### Testing Stack

```
Testing Pyramid:
├── E2E Tests (Jest + Supertest + TestContainers)
├── Integration Tests (Jest + TestContainers)
└── Unit Tests (Jest + Mocks)
```

## Project Structure

```
src/
├── domain/                     # Enterprise Business Rules
│   ├── entities/              # Business entities
│   ├── value-objects/         # Value objects
│   ├── repositories/          # Repository interfaces (ports)
│   └── services/              # Domain services
│
├── application/               # Application Business Rules
│   ├── use-cases/            # Use case implementations
│   ├── ports/                # Input/Output ports (interfaces)
│   ├── services/             # Application services
│   └── dtos/                 # Data Transfer Objects
│
├── infrastructure/           # Frameworks & Drivers
│   ├── repositories/         # Repository implementations (adapters)
│   ├── database/            # Database configuration & migrations
│   ├── external-services/   # Third-party service adapters
│   └── config/              # Configuration management
│
├── presentation/            # Interface Adapters
│   ├── controllers/         # HTTP controllers
│   ├── routes/              # Route definitions
│   ├── middlewares/         # HTTP middlewares
│   └── schemas/             # Request/Response schemas
│
└── shared/                  # Shared utilities
    ├── types/               # Common types
    ├── utils/               # Utility functions
    └── constants/           # Application constants

tests/
├── unit/                    # Unit tests (isolated, fast)
│   ├── domain/             # Domain layer tests
│   └── application/        # Application layer tests
│
├── integration/            # Integration tests (with TestContainers)
│   ├── repositories/       # Repository integration tests
│   └── external-services/  # External service integration tests
│
└── e2e/                    # End-to-end tests
    └── api/                # Full API workflow tests
```

## Dependency Injection Pattern

### TSyringe Configuration

```typescript
// Container setup
import "reflect-metadata";
import { container } from "tsyringe";

// Register dependencies
container.register<IUserRepository>("UserRepository", {
  useClass: PostgreSQLUserRepository
});

container.register<IEmailService>("EmailService", {
  useClass: SendGridEmailService
});
```

### Usage in Clean Architecture

```typescript
// Domain Layer (No dependencies)
export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly name: UserName
  ) {}
}

// Application Layer (Depends on Domain)
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("EmailService") private emailService: IEmailService
  ) {}
}

// Infrastructure Layer (Implements interfaces)
@injectable()
export class PostgreSQLUserRepository implements IUserRepository {
  // Implementation details
}
```

## Testing Strategy

### 1. Unit Tests (Fast, Isolated)

```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockEmailService: jest.Mocked<IEmailService>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    mockEmailService = createMockEmailService();
    useCase = new CreateUserUseCase(mockUserRepository, mockEmailService);
  });

  it('should create user successfully', async () => {
    // Test implementation with mocks
  });
});
```

### 2. Integration Tests (TestContainers)

```typescript
describe('UserRepository Integration', () => {
  let container: StartedTestContainer;
  let repository: PostgreSQLUserRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase("testdb")
      .withUsername("test")
      .withPassword("test")
      .start();
    
    // Setup repository with real database
    repository = new PostgreSQLUserRepository(/* connection */);
  });

  afterAll(async () => {
    await container.stop();
  });

  it('should persist user correctly', async () => {
    // Test with real database
  });
});
```

### 3. E2E Tests (Full Stack)

```typescript
describe('User API E2E', () => {
  let app: FastifyInstance;
  let dbContainer: StartedTestContainer;

  beforeAll(async () => {
    // Start TestContainers
    dbContainer = await new PostgreSqlContainer().start();
    
    // Setup application with test containers
    app = await createTestApp({
      database: dbContainer.getConnectionUri()
    });
  });

  it('POST /users should create user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { email: 'test@example.com', name: 'Test User' }
    });

    expect(response.statusCode).toBe(201);
  });
});
```

## Benefits of This Architecture

### 1. **Testability**
- **Unit Tests**: Fast, isolated tests for business logic
- **Integration Tests**: Real database/service testing with TestContainers
- **Mocking**: Easy to mock dependencies at boundaries

### 2. **Maintainability**
- **Clear Boundaries**: Each layer has distinct responsibilities
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Single Responsibility**: Each class/module has one reason to change

### 3. **Flexibility**
- **Database Agnostic**: Easy to switch from PostgreSQL to MongoDB
- **Service Swapping**: Replace email service without touching business logic
- **Framework Independence**: Business logic doesn't depend on Fastify

### 4. **Performance**
- **Fast Unit Tests**: No I/O operations in domain/application tests
- **Controlled Integration**: TestContainers provide isolated environments
- **Efficient Development**: Quick feedback loop with proper test pyramid

## Implementation Phases

### Phase 1: Foundation
1. Set up project structure
2. Configure TSyringe for dependency injection
3. Set up Jest with TestContainers
4. Create basic domain entities and value objects

### Phase 2: Core Features
1. Implement use cases in application layer
2. Create repository interfaces (ports)
3. Implement repository adapters with Prisma
4. Add comprehensive unit tests

### Phase 3: Web Layer
1. Set up Fastify with dependency injection
2. Create controllers and routes
3. Add request/response validation with Zod
4. Implement error handling middleware

### Phase 4: Integration & E2E
1. Add TestContainers integration tests
2. Create E2E test suite
3. Set up CI/CD pipeline
4. Add monitoring and logging

## Best Practices

### Testing
- **Test Pyramid**: More unit tests, fewer integration tests, minimal E2E tests
- **Test Isolation**: Each test should be independent and repeatable
- **Real Dependencies**: Use TestContainers for integration tests, not mocks
- **Fast Feedback**: Unit tests should run in milliseconds

### Architecture
- **Dependency Rule**: Dependencies point inward toward the domain
- **Interface Segregation**: Create focused, single-purpose interfaces
- **Immutability**: Prefer immutable objects, especially in domain layer
- **Error Handling**: Use Result/Either patterns for explicit error handling

### Development Workflow
1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code while keeping tests green
4. **Integrate**: Run integration tests to ensure system coherence

## Conclusion

This architecture provides a solid foundation for building maintainable, testable, and scalable web APIs using advanced TDD practices. The combination of clean architecture principles, dependency injection, and TestContainers creates a development environment that supports rapid iteration while maintaining high code quality.

The separation of concerns allows teams to work independently on different layers, while the comprehensive testing strategy ensures system reliability and enables confident refactoring and feature development.
