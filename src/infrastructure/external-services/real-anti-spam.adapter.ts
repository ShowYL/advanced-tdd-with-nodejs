import { AntiSpamPort } from '../../domain/ports/anti-spam.port.js';

/**
 * RealAntiSpamAdapter - Production Implementation
 *
 * This adapter is used in INTEGRATION and PRODUCTION environments.
 * It calls a real anti-spam API to check if emails are blocked.
 *
 * Example services:
 * - Akismet (https://akismet.com)
 * - Spamhaus (https://www.spamhaus.org)
 * - Custom internal service
 *
 * This adapter demonstrates how to integrate external services
 * while maintaining clean architecture principles.
 */
export class RealAntiSpamAdapter implements AntiSpamPort {
  constructor(private readonly apiKey: string) {}

  /**
   * Checks if an email is blocked using a real anti-spam API
   *
   * @param email - The email address to check
   * @returns Promise<boolean> - true if blocked, false if allowed
   *
   * @throws Error if API communication fails unexpectedly
   *
   * Note: This is a simplified example. In production, you would:
   * - Add retry logic for transient failures
   * - Add request timeouts
   * - Add rate limiting
   * - Add caching for performance
   * - Add monitoring and logging
   */
  async isBlocked(email: string): Promise<boolean> {
    try {
      // Call to a real anti-spam API
      // This is a placeholder - replace with actual API endpoint
      const response = await fetch('https://api.antispam.example.com/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { blocked: boolean };
      return data.blocked;
    } catch (error) {
      // Error handling strategy: Fail Open (allow email)
      // This means if the anti-spam service is down, we allow the email
      // Alternative: Fail Closed (block email) - more conservative but may reject valid users
      console.error('Anti-spam check failed:', error);
      return false; // Allow email if service is down
    }
  }
}
