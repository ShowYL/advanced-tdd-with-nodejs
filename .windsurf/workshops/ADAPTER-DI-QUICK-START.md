# Adapter Pattern & DI - Quick Start Guide

## What You're Learning

You're learning how to integrate **external services** (like anti-spam APIs) into your domain layer using **clean architecture principles**:

- **Port** = Interface that defines what the domain needs
- **Adapter** = Implementation that fulfills the port
- **Dependency Injection** = Passing adapters as parameters
- **Testing Doubles** = Using mocks for fast unit tests, real implementations for integration tests

## The Problem We're Solving

```
❌ BAD: Email class hardcodes anti-spam service
export class Email {
  constructor(email: string) {
    const antiSpam = new RealAntiSpamAdapter(); // Hardcoded!
    if (await antiSpam.isBlocked(email)) {
      throw new Error('Blocked');
    }
  }
}

Problems:
- Can't test without calling real API
- Tests are slow and flaky
- Hard to test edge cases
- Tightly coupled to implementation
```

```
✅ GOOD: Email receives anti-spam service as parameter
export class Email {
  static async createWithAntiSpamCheck(
    email: string,
    antiSpamService: AntiSpamPort // Injected!
  ) {
    if (await antiSpamService.isBlocked(email)) {
      throw new Error('Blocked');
    }
  }
}

Benefits:
- Can pass mock for unit tests (fast)
- Can pass real for integration tests (accurate)
- Can pass stub for specific scenarios
- Loosely coupled to implementation
```

## Files You Need to Understand

### 1. Port (Domain Layer)
**File**: `src/domain/ports/anti-spam.port.ts`

```typescript
export interface AntiSpamPort {
  isBlocked(email: string): Promise<boolean>;
}
```

**What it is**: A contract that says "anything that checks emails must have an `isBlocked()` method"

**Why it matters**: The domain doesn't care if it's a mock, real API, or database lookup

### 2. Mock Adapter (Infrastructure - for Unit Tests)
**File**: `src/infrastructure/external-services/mock-anti-spam.adapter.ts`

```typescript
export class MockAntiSpamAdapter implements AntiSpamPort {
  async isBlocked(email: string): Promise<boolean> {
    // Fast, deterministic, no network calls
    return email.includes('blocked@');
  }
}
```

**When to use**: Unit tests (fast, isolated)

**Why**: No external dependencies, tests run in milliseconds

### 3. Real Adapter (Infrastructure - for Integration Tests)
**File**: `src/infrastructure/external-services/real-anti-spam.adapter.ts`

```typescript
export class RealAntiSpamAdapter implements AntiSpamPort {
  async isBlocked(email: string): Promise<boolean> {
    // Calls actual API
    const response = await fetch('https://api.antispam.example.com/check', {
      // ...
    });
    return response.data.blocked;
  }
}
```

**When to use**: Integration tests, production (real behavior)

**Why**: Tests real system behavior, but slower

## How to Use It

### In Unit Tests (Use Mock)

```typescript
import { Email } from '../../../../src/domain/value-objects/email.js';
import { MockAntiSpamAdapter } from '../../../../src/infrastructure/external-services/mock-anti-spam.adapter.js';

describe('Email with Anti-Spam', () => {
  it('should reject blocked emails', async () => {
    const mockAntiSpam = new MockAntiSpamAdapter();
    
    // Pass mock as dependency
    await expect(
      Email.createWithAntiSpamCheck('blocked@example.com', mockAntiSpam)
    ).rejects.toThrow('Email is blocked');
  });
});
```

### In Integration Tests (Use Real)

```typescript
import { Email } from '../../../../src/domain/value-objects/email.js';
import { RealAntiSpamAdapter } from '../../../../src/infrastructure/external-services/real-anti-spam.adapter.js';

describe('Email with Real Anti-Spam', () => {
  it('should validate with real API', async () => {
    const realAntiSpam = new RealAntiSpamAdapter(process.env.API_KEY);
    
    // Pass real adapter as dependency
    const email = await Email.createWithAntiSpamCheck('user@gmail.com', realAntiSpam);
    expect(email.getValue()).toBe('user@gmail.com');
  });
});
```

## The Flow

```
1. Define Port (Interface)
   ↓
2. Create Adapters (Mock & Real)
   ↓
3. Modify Email to accept port as parameter
   ↓
4. Write Unit Tests with Mock
   ↓
5. Write Integration Tests with Real
   ↓
6. Update User to use Email with anti-spam
   ↓
7. Complete Checkpoints
```

## Key Takeaways

| Concept | Explanation | Example |
|---------|-------------|---------|
| **Port** | Interface/Contract | `AntiSpamPort` interface |
| **Adapter** | Implementation | `MockAntiSpamAdapter`, `RealAntiSpamAdapter` |
| **Dependency Injection** | Passing dependency as parameter | `Email.createWithAntiSpamCheck(email, antiSpamService)` |
| **Testing Double** | Fake implementation for testing | `MockAntiSpamAdapter` |
| **Separation of Concerns** | Domain doesn't know about implementation | Domain uses `AntiSpamPort`, not concrete class |

## Next Steps

1. **Read** the full workshop: `.windsurf/workshops/adapter-pattern-with-di.md`
2. **Implement** `Email.createWithAntiSpamCheck()` method
3. **Write** unit tests with `MockAntiSpamAdapter`
4. **Write** integration tests with `RealAntiSpamAdapter`
5. **Update** `User.createWithValidation()` method
6. **Complete** all checkpoints (🫵)
7. **Challenge** yourself with advanced exercises

## Common Questions

**Q: Why not just use the real adapter everywhere?**
A: Real adapters are slow (network calls), flaky (external service down), and hard to test edge cases. Mocks are fast, deterministic, and give you full control.

**Q: What if I need to test both mock and real?**
A: That's the point! Unit tests use mock (fast), integration tests use real (accurate). You get both speed and correctness.

**Q: Can I create my own adapter?**
A: Yes! Any class that implements `AntiSpamPort` is a valid adapter. You could create a `StubAntiSpamAdapter` that always allows, or a `CompositeAntiSpamAdapter` that checks multiple services.

**Q: How does this help with clean architecture?**
A: The domain layer depends on abstractions (ports), not concrete implementations (adapters). This means you can swap implementations without changing domain code.
