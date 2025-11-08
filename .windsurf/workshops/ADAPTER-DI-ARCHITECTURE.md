# Adapter Pattern & DI - Architecture Diagrams

## 1. Without Adapter Pattern (❌ BAD)

```
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│  ┌───────────────────────────────────┐  │
│  │  Email ValueObject                │  │
│  │                                   │  │
│  │  constructor(email: string) {     │  │
│  │    // Hardcoded dependency!       │  │
│  │    const antiSpam =               │  │
│  │      new RealAntiSpamAdapter()    │  │
│  │    if (antiSpam.isBlocked(email)) │  │
│  │      throw Error(...)             │  │
│  │  }                                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │
         ├─→ TIGHTLY COUPLED
         │
         ▼
┌─────────────────────────────────────────┐
│    Infrastructure Layer                 │
│  ┌───────────────────────────────────┐  │
│  │  RealAntiSpamAdapter              │  │
│  │  - Calls real API                 │  │
│  │  - Slow                           │  │
│  │  - Can't test without API         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

Problems:
❌ Can't test without real API
❌ Tests are slow and flaky
❌ Can't test edge cases easily
❌ Hard to swap implementations
❌ Domain depends on infrastructure
```

## 2. With Adapter Pattern (✅ GOOD)

```
┌──────────────────────────────────────────────────────────┐
│                    Domain Layer                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Port (Interface)                                  │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ export interface AntiSpamPort {              │  │  │
│  │  │   isBlocked(email: string): Promise<boolean> │  │  │
│  │  │ }                                            │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  Email ValueObject                                │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ static async createWithAntiSpamCheck(        │  │  │
│  │  │   email: string,                             │  │  │
│  │  │   antiSpamService: AntiSpamPort // Injected! │  │  │
│  │  │ ) {                                          │  │  │
│  │  │   if (await antiSpamService.isBlocked(...)) │  │  │
│  │  │     throw Error(...)                         │  │  │
│  │  │ }                                            │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
         │
         ├─→ LOOSELY COUPLED
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│              Infrastructure Layer                        │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │ MockAdapter    │  │ RealAdapter    │  │ StubAdapter│ │
│  │                │  │                │  │            │ │
│  │ Fast ✓         │  │ Real API ✓     │  │ Always OK ✓│ │
│  │ Deterministic ✓│  │ Production ✓   │  │ Testing ✓  │ │
│  │ No Network ✓   │  │ Accurate ✓     │  │ Specific ✓ │ │
│  └────────────────┘  └────────────────┘  └────────────┘ │
└──────────────────────────────────────────────────────────┘

Benefits:
✅ Can test with mock (fast)
✅ Can test with real (accurate)
✅ Can test with stub (specific scenarios)
✅ Easy to swap implementations
✅ Domain independent of infrastructure
```

## 3. Dependency Flow

### Without DI (Tightly Coupled)

```
Email
  │
  ├─→ depends on ─→ RealAntiSpamAdapter
                      │
                      ├─→ depends on ─→ HTTP Client
                      │
                      ├─→ depends on ─→ API Key
                      │
                      └─→ depends on ─→ External API

Problem: Can't change RealAntiSpamAdapter without changing Email
```

### With DI (Loosely Coupled)

```
Email
  │
  ├─→ depends on ─→ AntiSpamPort (Interface)
                      │
                      ├─→ implemented by ─→ MockAntiSpamAdapter
                      │                       (Unit Tests)
                      │
                      ├─→ implemented by ─→ RealAntiSpamAdapter
                      │                       (Integration Tests)
                      │
                      └─→ implemented by ─→ StubAntiSpamAdapter
                                            (Special Cases)

Benefit: Can change adapter without changing Email
```

## 4. Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      E2E Tests                             │
│                    (Full Stack)                            │
│                  RealAntiSpamAdapter                       │
│                   Slow (seconds)                           │
│                    Few tests                               │
│                                                             │
│                  ┌─────────────────┐                       │
│                  │ Integration     │                       │
│                  │ Tests           │                       │
│                  │ RealAdapter     │                       │
│                  │ Medium speed    │                       │
│                  │ More tests      │                       │
│                  └─────────────────┘                       │
│                                                             │
│          ┌──────────────────────────────┐                  │
│          │ Unit Tests                   │                  │
│          │ MockAntiSpamAdapter          │                  │
│          │ Fast (milliseconds)          │                  │
│          │ Most tests                   │                  │
│          └──────────────────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Unit Tests (Mock):
- Fast: No network calls
- Deterministic: Same input = same output
- Isolated: No external dependencies
- Controlled: Easy to test edge cases

Integration Tests (Real):
- Accurate: Tests real behavior
- Complete: Tests full system
- Realistic: Uses real API
- Slower: Network calls
```

## 5. Adapter Implementation Comparison

```
┌──────────────────────────────────────────────────────────────┐
│                    AntiSpamPort                              │
│              (Interface/Contract)                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ isBlocked(email: string): Promise<boolean>             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
  │
  ├─────────────────────────────────────────────────────────────┐
  │                                                             │
  ▼                                                             ▼
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│   MockAntiSpamAdapter            │  │   RealAntiSpamAdapter            │
├──────────────────────────────────┤  ├──────────────────────────────────┤
│ implements AntiSpamPort          │  │ implements AntiSpamPort          │
│                                  │  │                                  │
│ async isBlocked(email) {          │  │ async isBlocked(email) {         │
│   // Check hardcoded lists        │  │   // Call real API               │
│   return email.includes('blocked')│  │   const response = await fetch() │
│ }                                │  │   return response.data.blocked   │
│                                  │  │ }                                │
│ Properties:                      │  │ Properties:                      │
│ ✓ Fast (no network)              │  │ ✓ Real behavior                  │
│ ✓ Deterministic                  │  │ ✓ Production-ready               │
│ ✓ No external dependencies       │  │ ✓ Accurate                       │
│ ✓ Easy to test edge cases        │  │ ✓ Handles real errors            │
│ ✗ Not realistic                  │  │ ✗ Slow (network calls)           │
│ ✗ Limited scenarios              │  │ ✗ Flaky (external service)       │
└──────────────────────────────────┘  └──────────────────────────────────┘
```

## 6. Dependency Injection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Application Code                          │
│                                                             │
│  Unit Test:                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ const mockAdapter = new MockAntiSpamAdapter()        │  │
│  │ const email = await Email.createWithAntiSpamCheck(   │  │
│  │   'user@gmail.com',                                  │  │
│  │   mockAdapter  // ← Injected                         │  │
│  │ )                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Integration Test:                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ const realAdapter = new RealAntiSpamAdapter(apiKey)  │  │
│  │ const email = await Email.createWithAntiSpamCheck(   │  │
│  │   'user@gmail.com',                                  │  │
│  │   realAdapter  // ← Injected                         │  │
│  │ )                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Key Insight:                                               │
│  Email doesn't care which adapter is passed!               │
│  It only knows that it implements AntiSpamPort             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 7. Clean Architecture Layers

```
┌──────────────────────────────────────────────────────────────┐
│                  Presentation Layer                          │
│              (Controllers, Routes, HTTP)                     │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                 Application Layer                            │
│              (Use Cases, Services)                           │
│                                                              │
│  CreateUserUseCase                                           │
│  - Receives: email string, name string, antiSpamService     │
│  - Creates: Email with anti-spam check                      │
│  - Creates: User                                            │
│  - Returns: User                                            │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   Domain Layer                               │
│         (Entities, Value Objects, Ports)                    │
│                                                              │
│  Email ValueObject                                           │
│  - Depends on: AntiSpamPort (interface)                     │
│  - Does NOT depend on: RealAntiSpamAdapter                  │
│                                                              │
│  AntiSpamPort (Interface)                                   │
│  - Defines contract: isBlocked(email): Promise<boolean>    │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              Infrastructure Layer                            │
│            (Adapters, External Services)                    │
│                                                              │
│  MockAntiSpamAdapter ─┐                                     │
│  RealAntiSpamAdapter ─┼─→ implements AntiSpamPort           │
│  StubAntiSpamAdapter ─┘                                     │
│                                                              │
│  All implement the port interface                           │
└──────────────────────────────────────────────────────────────┘

Dependency Rule:
- Presentation depends on Application
- Application depends on Domain
- Infrastructure depends on Domain (via ports)
- Domain depends on NOTHING (pure business logic)
```

## 8. When to Use Each Adapter

```
┌─────────────────────────────────────────────────────────────┐
│                  Adapter Selection Guide                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Unit Tests                                                 │
│  ├─→ Use: MockAntiSpamAdapter                              │
│  ├─→ Why: Fast, deterministic, no external dependencies    │
│  ├─→ Speed: Milliseconds                                   │
│  ├─→ Reliability: 100% (no external service)               │
│  └─→ Example: Testing Email validation logic               │
│                                                             │
│  Integration Tests                                          │
│  ├─→ Use: RealAntiSpamAdapter                              │
│  ├─→ Why: Tests real system behavior                       │
│  ├─→ Speed: Seconds (network calls)                        │
│  ├─→ Reliability: Depends on external service              │
│  └─→ Example: Testing Email with real API                  │
│                                                             │
│  Production                                                 │
│  ├─→ Use: RealAntiSpamAdapter                              │
│  ├─→ Why: Actual anti-spam protection                      │
│  ├─→ Speed: Seconds (network calls)                        │
│  ├─→ Reliability: Must handle failures gracefully          │
│  └─→ Example: Creating real users                          │
│                                                             │
│  Special Testing Scenarios                                  │
│  ├─→ Use: StubAntiSpamAdapter (always allow)               │
│  ├─→ Why: Test specific scenarios without anti-spam        │
│  ├─→ Speed: Milliseconds                                   │
│  ├─→ Reliability: 100% (no external service)               │
│  └─→ Example: Testing user creation flow                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 9. Error Handling Strategies

```
┌──────────────────────────────────────────────────────────────┐
│              Anti-Spam Service Failure Scenarios             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Scenario 1: API is Down                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Strategy: Fail Open (Allow)                            │ │
│  │ - Allow email if service is unavailable               │ │
│  │ - Better UX: Users can still sign up                  │ │
│  │ - Risk: Some spam might get through                   │ │
│  │ - Implementation: catch error, return false           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Scenario 2: API Timeout                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Strategy: Fail Open with Retry                        │ │
│  │ - Retry 3 times with exponential backoff              │ │
│  │ - Then fail open (allow)                              │ │
│  │ - Prevents cascading failures                         │ │
│  │ - Implementation: retry logic + timeout               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Scenario 3: Invalid Response                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Strategy: Log & Fail Open                             │ │
│  │ - Log the error for debugging                         │ │
│  │ - Allow email (fail open)                             │ │
│  │ - Alert ops team                                      │ │
│  │ - Implementation: error handling + logging            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Summary

The adapter pattern with dependency injection enables:

1. **Testability**: Use mocks for fast unit tests
2. **Flexibility**: Swap implementations without changing domain code
3. **Separation of Concerns**: Domain doesn't know about infrastructure
4. **Reusability**: Same port can have multiple adapters
5. **Maintainability**: Clear boundaries and responsibilities
