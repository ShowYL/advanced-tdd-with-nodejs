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