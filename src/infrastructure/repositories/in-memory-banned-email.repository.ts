import { BannedEmailRepository } from '../../domain/ports/banned-email.repository.js';

/**
 * MockBannedEmailRepository - Test Double
 *
 * This mock implementation is used for unit testing.
 * It stores banned emails in memory and allows test control.
 *
 * Use this for:
 * - Unit tests of ValkeyAntiSpamAdapter
 * - Tests where you don't need real Valkey
 * - Fast test execution
 *
 * Use ValkeyBannedEmailRepository with TestContainers for:
 * - Integration tests
 * - Testing real Valkey behavior
 */
export class InMemoryBannedEmailRepository implements BannedEmailRepository {
  private bannedEmails: Set<string> = new Set();

  async isBanned(email: string): Promise<boolean> {
    return this.bannedEmails.has(email.toLowerCase());
  }

  async ban(email: string): Promise<void> {
    this.bannedEmails.add(email.toLowerCase());
  }

  async unban(email: string): Promise<void> {
    this.bannedEmails.delete(email.toLowerCase());
  }

  async getAllBanned(): Promise<string[]> {
    return Array.from(this.bannedEmails);
  }

  async clear(): Promise<void> {
    this.bannedEmails.clear();
  }
}
