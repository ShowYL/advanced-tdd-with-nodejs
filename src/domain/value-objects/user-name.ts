import { ValueObject } from '../../shared/types/common.js';

export class UserName extends ValueObject<string> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 50;
  private static readonly VALID_NAME_REGEX = /^[a-zA-Z\s'-]+$/;

  constructor(name: string) {
    if (!UserName.isValid(name)) {
      throw new Error(`Invalid user name: ${name}`);
    }
    super(name.trim());
  }

  public static isValid(name: string): boolean {
    if (typeof name !== 'string') return false;
    
    const trimmedName = name.trim();
    return trimmedName.length >= UserName.MIN_LENGTH &&
           trimmedName.length <= UserName.MAX_LENGTH &&
           UserName.VALID_NAME_REGEX.test(trimmedName);
  }

  public static create(name: string): UserName {
    return new UserName(name);
  }

  public getFirstName(): string {
    return this.value.split(' ')[0];
  }

  public getLastName(): string {
    const parts = this.value.split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  public getInitials(): string {
    return this.value
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }
}
