import { Email } from '../../../../src/domain/value-objects/email.js';
import { MockAntiSpamAdapter } from '../../../../src/infrastructure/external-services/mock-anti-spam.adapter.js';

describe('Email with Anti-Spam Validation', () => {
  let mockAntiSpam: MockAntiSpamAdapter;

  beforeEach(() => {
    mockAntiSpam = new MockAntiSpamAdapter();
  });

  describe('createWithoutSpam()', () => {
    // 🫵 CHECKPOINT 4.1.1: Write tests for valid emails
    // Write at least 3 test cases for emails that should be ALLOWED
    // Examples: 'user@gmail.com', 'john@company.com', 'test@example.org'
    it('should create email for valid, non-blocked email', async () => {
      const email = await Email.createWithoutSpam(
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
        Email.createWithoutSpam('blocked@example.com', mockAntiSpam)
      ).rejects.toThrow('Email is blocked or blacklisted');
    });

    it('should reject email from blocked domain', async () => {
      await expect(
        Email.createWithoutSpam('user@spam.com', mockAntiSpam)
      ).rejects.toThrow('Email is blocked or blacklisted');
    });

    // 🫵 CHECKPOINT 4.1.3: Explain the difference
    // Why do we use async/await here but not in the simple create() method?
    // What does this teach about side effects in value objects?
  });

  describe('create() vs createWithoutSpam()', () => {
    // 🫵 CHECKPOINT 4.1.4: Compare behaviors
    // Write a test that shows:
    // - create() allows 'blocked@example.com'
    // - createWithoutSpam() rejects 'blocked@example.com'
    // What does this teach about when to add validation?
    it('should show difference between simple and anti-spam validation', async () => {
      // Simple create should work
      const simpleEmail = Email.create('blocked@example.com');
      expect(simpleEmail.getValue()).toBe('blocked@example.com');

      // But anti-spam check should reject it
      await expect(
        Email.createWithoutSpam('blocked@example.com', mockAntiSpam)
      ).rejects.toThrow();
    });
  });
});