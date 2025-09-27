import { ValueObject } from '../../shared/types/common.js';
import { randomUUID } from 'crypto';

export class UserId extends ValueObject<string> {
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(id: string) {
    if (!UserId.isValid(id)) {
      throw new Error(`Invalid UserId format: ${id}`);
    }
    super(id);
  }

  public static isValid(id: string): boolean {
    return typeof id === 'string' && UserId.UUID_REGEX.test(id);
  }

  public static create(id?: string): UserId {
    return new UserId(id || randomUUID());
  }

  public static generate(): UserId {
    return new UserId(randomUUID());
  }
}
