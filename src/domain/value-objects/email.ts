import { AntiSpamPort } from '@domain/ports/anti-spam.port.js';
import { ValueObject } from '../../shared/types/common.js';

export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private static hasConsecutiveDots(email: string): boolean {
    return email.includes('..');
  }

  constructor(email: string) {
    const normalized = email.trim();

    if (!Email.isValid(normalized)) {
      throw new Error(`Invalid email format: ${normalized}`);
    }
    super(normalized.toLowerCase());
  }

  public static isValid(email: string): boolean {
    return email.length > 0 && email.length <= 254 && !Email.hasConsecutiveDots(email) && Email.EMAIL_REGEX.test(email);
  }

  public static create(email: string): Email {
    return new Email(email);
  }

  public static async createWithoutSpam(email: string, antiSpamService: AntiSpamPort): Promise<Email> {
    if (await antiSpamService.isBlocked(email)) {
      throw new Error(`Email is blocked or blacklisted: ${email}`);
    }

    return new Email(email);
  }

  public getDomain(): string {
    return this.value.split('@')[1];
  }

  public getLocalPart(): string {
    return this.value.split('@')[0];
  }
}
