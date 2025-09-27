import { User } from 'domain/entities/user';
import { UserId } from 'domain/value-objects/user-id';
import { Email } from 'domain/value-objects/email';
import { UserName } from 'domain/value-objects/user-name';

describe('User Entity', () => {
  const validEmail = Email.create('test@example.com');
  const validName = UserName.create('John Doe');
  const validId = UserId.generate();

  describe('create', () => {
    it('should create a new user with generated ID', () => {
      const user = User.create(validEmail, validName);
      
      expect(user.email).toBe(validEmail);
      expect(user.name).toBe(validName);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.createdAt).toEqual(user.updatedAt);
    });

    it('should create a new user with provided ID', () => {
      const user = User.create(validEmail, validName, validId);
      
      expect(user.id).toBe(validId);
      expect(user.email).toBe(validEmail);
      expect(user.name).toBe(validName);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute user from props', () => {
      const now = new Date();
      const props = {
        id: validId,
        email: validEmail,
        name: validName,
        createdAt: now,
        updatedAt: now,
      };

      const user = User.reconstitute(props);

      expect(user.id).toBe(validId);
      expect(user.email).toBe(validEmail);
      expect(user.name).toBe(validName);
      expect(user.createdAt).toBe(now);
      expect(user.updatedAt).toBe(now);
    });
  });

  describe('updateEmail', () => {
    it('should update email and updatedAt timestamp', () => {
      const user = User.create(validEmail, validName);
      const newEmail = Email.create('newemail@example.com');
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      const updatedUser = user.updateEmail(newEmail);

      expect(updatedUser.email).toBe(newEmail);
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
      expect(updatedUser.id).toBe(user.id); // ID should remain the same
      expect(updatedUser.name).toBe(user.name); // Name should remain the same
      expect(updatedUser.createdAt).toBe(user.createdAt); // CreatedAt should remain the same
    });

    it('should return a new instance (immutability)', () => {
      const user = User.create(validEmail, validName);
      const newEmail = Email.create('newemail@example.com');
      const updatedUser = user.updateEmail(newEmail);

      expect(updatedUser).not.toBe(user); // Different instances
      expect(user.email).toBe(validEmail); // Original unchanged
    });
  });

  describe('updateName', () => {
    it('should update name and updatedAt timestamp', () => {
      const user = User.create(validEmail, validName);
      const newName = UserName.create('Jane Smith');
      const originalUpdatedAt = user.updatedAt;

      const updatedUser = user.updateName(newName);

      expect(updatedUser.name).toBe(newName);
      expect(updatedUser.updatedAt.getTime()).toBe(originalUpdatedAt.getTime());
      expect(updatedUser.id).toBe(user.id); // ID should remain the same
      expect(updatedUser.email).toBe(user.email); // Email should remain the same
      expect(updatedUser.createdAt).toBe(user.createdAt); // CreatedAt should remain the same
    });

    it('should return a new instance (immutability)', () => {
      const user = User.create(validEmail, validName);
      const newName = UserName.create('Jane Smith');
      const updatedUser = user.updateName(newName);

      expect(updatedUser).not.toBe(user); // Different instances
      expect(user.name).toBe(validName); // Original unchanged
    });
  });

  describe('equals', () => {
    it('should return true for users with same ID', () => {
      const user1 = User.create(validEmail, validName, validId);
      const user2 = User.create(
        Email.create('different@example.com'),
        UserName.create('Different Name'),
        validId
      );

      expect(user1.equals(user2)).toBe(true);
    });

    it('should return false for users with different IDs', () => {
      const user1 = User.create(validEmail, validName);
      const user2 = User.create(validEmail, validName);

      expect(user1.equals(user2)).toBe(false);
    });

    it('should return false when comparing with non-User entity', () => {
      const user = User.create(validEmail, validName);
      const mockEntity = { id: user.id, equals: jest.fn() };

      expect(user.equals(mockEntity as any)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return JSON representation', () => {
      const user = User.create(validEmail, validName, validId);
      const json = user.toJSON();

      expect(json).toEqual({
        id: validId.getValue(),
        email: validEmail.getValue(),
        name: validName.getValue(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });
  });
});
