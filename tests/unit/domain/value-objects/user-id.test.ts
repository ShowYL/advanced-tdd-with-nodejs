import { UserId } from 'domain/value-objects/user-id';

describe('UserId Value Object', () => {
  describe('constructor', () => {
    it('should create a valid UserId with UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const userId = new UserId(validUuid);
      expect(userId.getValue()).toBe(validUuid);
    });

    it('should throw error for invalid UUID format', () => {
      expect(() => new UserId('invalid-uuid')).toThrow('Invalid UserId format');
      expect(() => new UserId('')).toThrow('Invalid UserId format');
      expect(() => new UserId('123')).toThrow('Invalid UserId format');
    });
  });

  describe('isValid', () => {
    it('should return true for valid UUIDs', () => {
      expect(UserId.isValid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(UserId.isValid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should return false for invalid UUIDs', () => {
      expect(UserId.isValid('')).toBe(false);
      expect(UserId.isValid('invalid')).toBe(false);
      expect(UserId.isValid('123-456-789')).toBe(false);
      expect(UserId.isValid('123e4567-e89b-12d3-a456')).toBe(false);
    });
  });

  describe('create', () => {
    it('should create UserId with provided UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const userId = UserId.create(validUuid);
      expect(userId.getValue()).toBe(validUuid);
    });

    it('should generate new UUID when no ID provided', () => {
      const userId = UserId.create();
      expect(UserId.isValid(userId.getValue())).toBe(true);
    });
  });

  describe('generate', () => {
    it('should generate a valid UUID', () => {
      const userId = UserId.generate();
      expect(UserId.isValid(userId.getValue())).toBe(true);
    });

    it('should generate unique UUIDs', () => {
      const userId1 = UserId.generate();
      const userId2 = UserId.generate();
      expect(userId1.getValue()).not.toBe(userId2.getValue());
    });
  });

  describe('equals', () => {
    it('should return true for equal UserIds', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const userId1 = new UserId(uuid);
      const userId2 = new UserId(uuid);
      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false for different UserIds', () => {
      const userId1 = UserId.generate();
      const userId2 = UserId.generate();
      expect(userId1.equals(userId2)).toBe(false);
    });
  });
});
