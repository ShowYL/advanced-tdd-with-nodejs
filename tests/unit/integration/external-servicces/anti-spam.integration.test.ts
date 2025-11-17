import { Email } from '../../../../src/domain/value-objects/email';
import { RealAntiSpamAdapter } from '../../../../src/infrastructure/external-services/real-anti-spam.adapter';

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
      const email = await Email.createWithoutSpam(
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