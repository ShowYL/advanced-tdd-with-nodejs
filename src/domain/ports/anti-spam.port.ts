/**
 * AntiSpamPort - Domain Port (Interface)
 *
 * This is a port that defines what the domain needs from an anti-spam service.
 * It does NOT define HOW the service works, only WHAT it should do.
 *
 * Any adapter (mock, real, stub) must implement this interface.
 * This enables dependency injection and easy testing with doubles.
 */
export interface AntiSpamPort {
  /**
   * Checks if an email is blocked or blacklisted
   *
   * @param email - The email address to check
   * @returns Promise<boolean> - true if email is blocked, false if allowed
   *
   * @throws Error if the check fails unexpectedly
   *
   * @example
   * const isBlocked = await antiSpamService.isBlocked('user@gmail.com');
   * if (isBlocked) {
   *   throw new Error('Email is blocked');
   * }
   */
  isBlocked(email: string): Promise<boolean>;
}
