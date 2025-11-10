import { AntiSpamPort } from '../../domain/ports/anti-spam.port.js';

/**
 * MockAntiSpamAdapter - Test Double Implementation
 *
 * This adapter is used in UNIT TESTS.
 * It provides fast, deterministic behavior without calling external APIs.
 *
 * Blocks emails with:
 * - Specific patterns (e.g., "blocked@", "spam@")
 * - blocked domains (e.g., "spam.com", "fake.com")
 *
 * This allows us to test the Email and User creation logic
 * without depending on external services.
 */
export class MockAntiSpamAdapter implements AntiSpamPort {
  private readonly blockedDomains = ['spam.com', 'fake.com', 'bot.net'];
  private readonly blockedPatterns = ['blocked@', 'spam@'];

  /**
   * Checks if an email is blocked using mock rules
   *
   * @param email - The email address to check
   * @returns Promise<boolean> - true if blocked, false if allowed
   */
  async isBlocked(email: string): Promise<boolean> {
    // Check blocked patterns first
    for (const pattern of this.blockedPatterns) {
      if (email.startsWith(pattern)) {
        return true;
      }
    }

    // Check blocked domains
    const domain = email.split('@')[1];
    if (domain && this.blockedDomains.includes(domain)) {
      return true;
    }

    // Email is allowed
    return false;
  }
}
