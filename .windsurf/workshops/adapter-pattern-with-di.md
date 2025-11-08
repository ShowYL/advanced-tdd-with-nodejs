---
description: Adapter Pattern & Dependency Injection - Email Validation with Anti-Spam Service
---

# Adapter Pattern & Dependency Injection: Email Validation with Anti-Spam

## Overview

This exercise teaches you how to integrate external services (like anti-spam APIs) into your domain layer using the **Adapter Pattern** and **Dependency Injection (DI)**. You'll learn to:

1. Define port interfaces (contracts) in the domain layer
2. Create adapters that implement those interfaces
3. Inject adapters into value objects for validation
4. Use test doubles (mocks) for unit testing
5. Use real implementations for integration testing

## Architecture: Ports & Adapters

```
Domain Layer (Business Rules)
    ↓
Port Interface (Contract)
    ↓
    ├─→ Adapter 1: Real Implementation (Production)
    ├─→ Adapter 2: Mock Implementation (Unit Tests)
    └─→ Adapter 3: Real Service (Integration Tests)
```

**Key Principle**: The domain layer defines what it needs (port), not how it's implemented (adapter).

---

## Part 1: Define the Port (Interface)

### 1.1 Create the Anti-Spam Port

Create a new file: `src/domain/ports/anti-spam.port.ts`

This interface defines what the domain needs from an anti-spam service:

```typescript
export interface AntiSpamPort {
  /**
   * Checks if an email is blocked or blacklisted
   * @param email - The email address to check
   * @returns true if email is blocked, false if allowed
   */
  isBlocked(email: string): Promise<boolean>;
}
```

**Why an interface?**
- The domain doesn't care if it's a real API, a mock, or a database lookup
- We can swap implementations without changing domain code
- Easy to test with different implementations

### 1.2 Understanding the Port

- **Port** = Contract/Interface that defines what the domain needs
- **Adapter** = Implementation that fulfills the contract
- **Dependency Inversion** = Domain depends on abstraction (port), not concrete implementation (adapter)

---

## Part 2: Create Adapter Implementations

### 2.1 Mock Adapter (for Unit Tests)

Create: `src/infrastructure/external-services/mock-anti-spam.adapter.ts`

```typescript
import { AntiSpamPort } from '../../domain/ports/anti-spam.port.js';

/**
 * Mock implementation for testing
 * Blocks emails with specific patterns (e.g., "blocked@", "spam@")
 */
export class MockAntiSpamAdapter implements AntiSpamPort {
  private readonly blockedDomains = ['spam.com', 'fake.com', 'bot.net'];
  private readonly blockedPatterns = ['blocked@', 'spam@'];

  async isBlocked(email: string): Promise<boolean> {
    // Check blocked patterns
    for (const pattern of this.blockedPatterns) {
      if (email.includes(pattern)) {
        return true;
      }
    }

    // Check blocked domains
    const domain = email.split('@')[1];
    return this.blockedDomains.includes(domain);
  }
}
```

**Why mock?**
- No external API calls during unit tests
- Fast and deterministic
- Controlled behavior for testing edge cases

### 2.2 Real Adapter (for Integration Tests)

Create: `src/infrastructure/external-services/real-anti-spam.adapter.ts`

```typescript
import { AntiSpamPort } from '../../domain/ports/anti-spam.port.js';

/**
 * Real implementation that calls an actual anti-spam API
 * Example: Could be Akismet, Spamhaus, or custom service
 */
export class RealAntiSpamAdapter implements AntiSpamPort {
  constructor(private readonly apiKey: string) {}

  async isBlocked(email: string): Promise<boolean> {
    try {
      // Example: Call to a real anti-spam API
      const response = await fetch('https://api.antispam.example.com/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusCode}`);
      }

      const data = await response.json() as { blocked: boolean };
      return data.blocked;
    } catch (error) {
      // In production, decide: fail open (allow) or fail closed (block)
      console.error('Anti-spam check failed:', error);
      return false; // Allow email if service is down
    }
  }
}
```

---

## Part 3: Modify Email ValueObject with Anti-Spam Validation

### 3.1 Update Email to Use Anti-Spam Port

Modify: `src/domain/value-objects/email.ts`

```typescript
import { ValueObject } from '../../shared/types/common.js';
import { AntiSpamPort } from '../ports/anti-spam.port.js';

export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  private static hasConsecutiveDots(email: string): boolean {
    return email.includes('..');
  }

  private constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
    super(email);
  }

  public static isValid(email: string): boolean {
    return email.length > 0 && email.length <= 254 && !Email.hasConsecutiveDots(email);
  }

  /**
   * Creates an Email with format validation only
   * Use this when you don't need anti-spam checks
   */
  public static create(email: string): Email {
    return new Email(email);
  }

  /**
   * Creates an Email with both format AND anti-spam validation
   * This is where the adapter is injected
   */
  public static async createWithAntiSpamCheck(
    email: string,
    antiSpamService: AntiSpamPort
  ): Promise<Email> {
    // First: validate format
    if (!Email.isValid(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    // Second: check anti-spam service
    const isBlocked = await antiSpamService.isBlocked(email);
    if (isBlocked) {
      throw new Error(`Email is blocked or blacklisted: ${email}`);
    }

    // If both checks pass, create the email
    return new Email(email);
  }

  public getDomain(): string {
    return this.value.split('@')[1];
  }

  public getLocalPart(): string {
    return this.value.split('@')[0];
  }
}
```

**Key Changes:**
- `create()` - Simple format validation (existing behavior)
- `createWithAntiSpamCheck()` - NEW: Adds anti-spam validation via injected adapter
- The adapter is passed as a parameter (dependency injection)

---

## Part 4: Unit Tests with Mock Adapter

### 4.1 Test Email Creation with Mock Anti-Spam

Create: `tests/unit/domain/value-objects/email-with-anti-spam.test.ts`

```typescript
import { Email } from '../../../../src/domain/value-objects/email.js';
import { MockAntiSpamAdapter } from '../../../../src/infrastructure/external-services/mock-anti-spam.adapter.js';

describe('Email with Anti-Spam Validation', () => {
  let mockAntiSpam: MockAntiSpamAdapter;

  beforeEach(() => {
    mockAntiSpam = new MockAntiSpamAdapter();
  });

  describe('createWithAntiSpamCheck()', () => {
    // 🫵 CHECKPOINT 4.1.1: Write tests for valid emails
    // Write at least 3 test cases for emails that should be ALLOWED
    // Examples: 'user@gmail.com', 'john@company.com', 'test@example.org'
    it('should create email for valid, non-blocked email', async () => {
      const email = await Email.createWithAntiSpamCheck(
        'user@gmail.com',
        mockAntiSpam
      );

      expect(email.getValue()).toBe('user@gmail.com');
    });

    // 🫵 CHECKPOINT 4.1.2: Write tests for blocked emails
    // Write at least 3 test cases for emails that should be BLOCKED
    // Examples: 'blocked@example.com', 'spam@spam.com', 'test@fake.com'
    it('should reject email with blocked pattern', async () => {
      await expect(
        Email.createWithAntiSpamCheck('blocked@example.com', mockAntiSpam)
      ).rejects.toThrow('Email is blocked or blacklisted');
    });

    it('should reject email from blocked domain', async () => {
      await expect(
        Email.createWithAntiSpamCheck('user@spam.com', mockAntiSpam)
      ).rejects.toThrow('Email is blocked or blacklisted');
    });

    // 🫵 CHECKPOINT 4.1.3: Explain the difference
    // Why do we use async/await here but not in the simple create() method?
    // What does this teach about side effects in value objects?
  });

  describe('create() vs createWithAntiSpamCheck()', () => {
    // 🫵 CHECKPOINT 4.1.4: Compare behaviors
    // Write a test that shows:
    // - create() allows 'blocked@example.com'
    // - createWithAntiSpamCheck() rejects 'blocked@example.com'
    // What does this teach about when to add validation?
    it('should show difference between simple and anti-spam validation', async () => {
      // Simple create should work
      const simpleEmail = Email.create('blocked@example.com');
      expect(simpleEmail.getValue()).toBe('blocked@example.com');

      // But anti-spam check should reject it
      await expect(
        Email.createWithAntiSpamCheck('blocked@example.com', mockAntiSpam)
      ).rejects.toThrow();
    });
  });
});
```

**Why Mock?**
- ✅ Fast: No network calls
- ✅ Deterministic: Same input always produces same output
- ✅ Isolated: Tests don't depend on external service
- ✅ Controlled: Easy to test edge cases

---

## Part 5: Integration Tests with Real Adapter

### 5.1 Test Email Creation with Real Anti-Spam

Create: `tests/integration/external-services/anti-spam.integration.test.ts`

```typescript
import { Email } from '../../../src/domain/value-objects/email.js';
import { RealAntiSpamAdapter } from '../../../src/infrastructure/external-services/real-anti-spam.adapter.js';

describe('Email with Real Anti-Spam Service (Integration)', () => {
  let realAntiSpam: RealAntiSpamAdapter;

  beforeEach(() => {
    // In real scenario, get API key from environment
    const apiKey = process.env.ANTI_SPAM_API_KEY || 'test-key';
    realAntiSpam = new RealAntiSpamAdapter(apiKey);
  });

  describe('createWithAntiSpamCheck() with real service', () => {
    // 🫵 CHECKPOINT 5.1.1: Understand integration test differences
    // Why might this test behave differently than unit tests?
    // What are the pros and cons of testing with real API?

    it('should validate email with real anti-spam service', async () => {
      // This test actually calls the real API
      // It's slower but tests real behavior
      const email = await Email.createWithAntiSpamCheck(
        'user@gmail.com',
        realAntiSpam
      );

      expect(email.getValue()).toBe('user@gmail.com');
    });

    // 🫵 CHECKPOINT 5.1.2: Handle API failures
    // What should happen if the real API is down?
    // Should we fail open (allow) or fail closed (block)?
    // Write a test that simulates API failure
  });
});
```

---

## Part 6: Create User with Anti-Spam Validation

### 6.1 Update User Entity

Modify: `src/domain/entities/user.ts`

```typescript
import { Entity } from '../../shared/types/common.js';
import { UserId } from '../value-objects/user-id.js';
import { Email } from '../value-objects/email.js';
import { UserName } from '../value-objects/user-name.js';
import { AntiSpamPort } from '../ports/anti-spam.port.js';

export interface UserProps {
  id: UserId;
  email: Email;
  name: UserName;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements Entity<UserId> {
  private constructor(private readonly props: UserProps) {}

  public static create(
    email: Email,
    name: UserName,
    id?: UserId
  ): User {
    const now = new Date();
    return new User({
      id: id || UserId.generate(),
      email,
      name,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates a user with anti-spam email validation
   * The adapter is injected as a dependency
   */
  public static async createWithValidation(
    emailString: string,
    nameString: string,
    antiSpamService: AntiSpamPort,
    id?: UserId
  ): Promise<User> {
    // Create email with anti-spam check (adapter is injected here)
    const email = await Email.createWithAntiSpamCheck(
      emailString,
      antiSpamService
    );

    // Create name
    const name = UserName.create(nameString);

    // Create user
    return User.create(email, name, id);
  }

  public static reconstitute(props: UserProps): User {
    return new User(props);
  }

  // ... rest of the methods remain the same
}
```

---

## Part 7: Complete Example - Unit Test

### 7.1 Test User Creation with Mock Anti-Spam

Create: `tests/unit/domain/entities/user-with-anti-spam.test.ts`

```typescript
import { User } from '../../../../src/domain/entities/user.js';
import { MockAntiSpamAdapter } from '../../../../src/infrastructure/external-services/mock-anti-spam.adapter.js';

describe('User Creation with Anti-Spam Validation', () => {
  let mockAntiSpam: MockAntiSpamAdapter;

  beforeEach(() => {
    mockAntiSpam = new MockAntiSpamAdapter();
  });

  describe('createWithValidation()', () => {
    // 🫵 CHECKPOINT 7.1.1: Test successful user creation
    // Write a test that creates a user with a valid email
    it('should create user with valid email', async () => {
      const user = await User.createWithValidation(
        'john@gmail.com',
        'John Doe',
        mockAntiSpam
      );

      expect(user.email.getValue()).toBe('john@gmail.com');
      expect(user.name.getValue()).toBe('John Doe');
    });

    // 🫵 CHECKPOINT 7.1.2: Test rejection of blocked email
    // Write a test that rejects a user with a blocked email
    it('should reject user with blocked email', async () => {
      await expect(
        User.createWithValidation(
          'blocked@example.com',
          'Spammer',
          mockAntiSpam
        )
      ).rejects.toThrow('Email is blocked or blacklisted');
    });

    // 🫵 CHECKPOINT 7.1.3: Test rejection of invalid email
    // Write a test that rejects a user with invalid email format
    it('should reject user with invalid email format', async () => {
      await expect(
        User.createWithValidation(
          'not-an-email',
          'Invalid User',
          mockAntiSpam
        )
      ).rejects.toThrow('Invalid email format');
    });
  });

  describe('Dependency Injection Benefits', () => {
    // 🫵 CHECKPOINT 7.1.4: Understand DI benefits
    // Why can we pass different implementations (mock, real, stub)?
    // What would happen if AntiSpamPort was hardcoded instead?
    it('should work with any AntiSpamPort implementation', async () => {
      // We can pass mock, real, or any other implementation
      // The User doesn't care - it just needs something that implements AntiSpamPort
      const user = await User.createWithValidation(
        'user@gmail.com',
        'Test User',
        mockAntiSpam // Could be real, stub, or any implementation
      );

      expect(user).toBeDefined();
    });
  });
});
```

---

## Part 8: Dependency Injection Container Setup

### 8.1 Register Adapters in DI Container

Create: `src/infrastructure/config/di-container.ts`

```typescript
import 'reflect-metadata';
import { container } from 'tsyringe';
import { AntiSpamPort } from '../../domain/ports/anti-spam.port.js';
import { MockAntiSpamAdapter } from '../external-services/mock-anti-spam.adapter.js';
import { RealAntiSpamAdapter } from '../external-services/real-anti-spam.adapter.js';

/**
 * Configure dependency injection container
 * This is where we decide which implementation to use
 */
export function setupDIContainer(environment: 'test' | 'integration' | 'production') {
  if (environment === 'test') {
    // Unit tests: Use mock (fast, deterministic)
    container.register<AntiSpamPort>('AntiSpamPort', {
      useClass: MockAntiSpamAdapter,
    });
  } else if (environment === 'integration') {
    // Integration tests: Use real service
    const apiKey = process.env.ANTI_SPAM_API_KEY || 'test-key';
    container.register<AntiSpamPort>('AntiSpamPort', {
      useValue: new RealAntiSpamAdapter(apiKey),
    });
  } else {
    // Production: Use real service with real API key
    const apiKey = process.env.ANTI_SPAM_API_KEY;
    if (!apiKey) {
      throw new Error('ANTI_SPAM_API_KEY environment variable is required');
    }
    container.register<AntiSpamPort>('AntiSpamPort', {
      useValue: new RealAntiSpamAdapter(apiKey),
    });
  }
}
```

---

## Part 9: Key Concepts Summary

### 9.1 Port (Interface)

```typescript
// Domain layer defines what it needs
export interface AntiSpamPort {
  isBlocked(email: string): Promise<boolean>;
}
```

**Purpose**: Contract that any adapter must fulfill

### 9.2 Adapter (Implementation)

```typescript
// Infrastructure layer implements the port
export class MockAntiSpamAdapter implements AntiSpamPort {
  async isBlocked(email: string): Promise<boolean> {
    // Mock implementation
  }
}
```

**Purpose**: Concrete implementation of the port

### 9.3 Dependency Injection

```typescript
// Domain layer receives adapter as parameter
public static async createWithAntiSpamCheck(
  email: string,
  antiSpamService: AntiSpamPort // Injected dependency
): Promise<Email> {
  // Use the injected adapter
  const isBlocked = await antiSpamService.isBlocked(email);
}
```

**Purpose**: Decouple domain from concrete implementations

### 9.4 Testing Benefits

| Aspect | Unit Test | Integration Test |
|--------|-----------|------------------|
| **Adapter** | Mock | Real |
| **Speed** | Fast (ms) | Slow (seconds) |
| **Network** | No | Yes |
| **Deterministic** | Yes | No |
| **Real Behavior** | No | Yes |
| **Purpose** | Business logic | System integration |

---

## Part 10: Checkpoints & Self-Assessment

### 10.1 Understanding Checkpoints

- **4.1.1**: Write valid email tests
- **4.1.2**: Write blocked email tests
- **4.1.3**: Explain async/await difference
- **4.1.4**: Compare create() vs createWithAntiSpamCheck()
- **5.1.1**: Understand integration test differences
- **5.1.2**: Handle API failures
- **7.1.1**: Test successful user creation
- **7.1.2**: Test rejection of blocked email
- **7.1.3**: Test rejection of invalid email
- **7.1.4**: Understand DI benefits

### 10.2 Self-Assessment Checklist

Before moving on, verify you understand:

- [ ] What is a Port? (interface/contract)
- [ ] What is an Adapter? (implementation)
- [ ] Why inject dependencies instead of hardcoding?
- [ ] Difference between mock and real adapters?
- [ ] When to use unit tests vs integration tests?
- [ ] How does DI enable testing with doubles?
- [ ] What happens if anti-spam service is down?

---

## Part 11: Advanced Challenges

### 11.1 Challenge: Create a Stub Adapter

Create a third adapter that always allows emails (for testing scenarios where you want to bypass anti-spam):

```typescript
export class StubAntiSpamAdapter implements AntiSpamPort {
  // 🫵 CHALLENGE 11.1.1: Implement this adapter
  // It should always return false (never block)
  // When would you use this in testing?
}
```

### 11.2 Challenge: Add Retry Logic

Modify `RealAntiSpamAdapter` to retry failed API calls:

```typescript
// 🫵 CHALLENGE 11.2.1: Add retry logic
// If API call fails, retry up to 3 times
// What should happen after 3 failures?
```

### 11.3 Challenge: Create a Composite Adapter

Create an adapter that uses multiple anti-spam services:

```typescript
export class CompositeAntiSpamAdapter implements AntiSpamPort {
  // 🫵 CHALLENGE 11.3.1: Implement this adapter
  // It should check email against multiple services
  // Should it use AND (all must allow) or OR (any can block)?
}
```

---

## Learning Outcomes

After completing this exercise, you should understand:

1. **Adapter Pattern**: How to create adapters that implement domain ports
2. **Dependency Injection**: How to inject dependencies for flexibility
3. **Testing Doubles**: When to use mocks vs real implementations
4. **Separation of Concerns**: Domain logic independent of external services
5. **Clean Architecture**: How ports & adapters enable testability
6. **Real-World Integration**: How to use real services in integration tests

---

## References

- **Ports & Adapters**: https://en.wikipedia.org/wiki/Hexagonal_architecture
- **Dependency Injection**: https://en.wikipedia.org/wiki/Dependency_injection
- **Testing Doubles**: https://martinfowler.com/bliki/TestDouble.html
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
