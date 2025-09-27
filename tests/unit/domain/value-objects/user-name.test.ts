import { UserName } from 'domain/value-objects/user-name';

describe('UserName Value Object', () => {
  describe('constructor', () => {
    it('should create a valid user name', () => {
      const userName = new UserName('John Doe');
      expect(userName.getValue()).toBe('John Doe');
    });

    it('should trim whitespace', () => {
      const userName = new UserName('  John Doe  ');
      expect(userName.getValue()).toBe('John Doe');
    });

    it('should throw error for invalid names', () => {
      expect(() => new UserName('')).toThrow('Invalid user name');
      expect(() => new UserName('A')).toThrow('Invalid user name'); // Too short
      expect(() => new UserName('A'.repeat(51))).toThrow('Invalid user name'); // Too long
      expect(() => new UserName('John123')).toThrow('Invalid user name'); // Contains numbers
      expect(() => new UserName('John@Doe')).toThrow('Invalid user name'); // Contains special chars
    });
  });

  describe('isValid', () => {
    it('should return true for valid names', () => {
      expect(UserName.isValid('John Doe')).toBe(true);
      expect(UserName.isValid('Mary Jane')).toBe(true);
      expect(UserName.isValid("O'Connor")).toBe(true);
      expect(UserName.isValid('Jean-Pierre')).toBe(true);
      expect(UserName.isValid('John')).toBe(true); // Single name
    });

    it('should return false for invalid names', () => {
      expect(UserName.isValid('')).toBe(false);
      expect(UserName.isValid('A')).toBe(false); // Too short
      expect(UserName.isValid('A'.repeat(51))).toBe(false); // Too long
      expect(UserName.isValid('John123')).toBe(false); // Contains numbers
      expect(UserName.isValid('John@Doe')).toBe(false); // Contains invalid chars
      expect(UserName.isValid('   ')).toBe(false); // Only whitespace
    });
  });

  describe('create', () => {
    it('should create user name using static factory method', () => {
      const userName = UserName.create('John Doe');
      expect(userName.getValue()).toBe('John Doe');
    });
  });

  describe('getFirstName', () => {
    it('should return the first name', () => {
      const userName = new UserName('John Doe');
      expect(userName.getFirstName()).toBe('John');
    });

    it('should return the only name for single names', () => {
      const userName = new UserName('John');
      expect(userName.getFirstName()).toBe('John');
    });
  });

  describe('getLastName', () => {
    it('should return the last name', () => {
      const userName = new UserName('John Doe');
      expect(userName.getLastName()).toBe('Doe');
    });

    it('should return the last name for multiple names', () => {
      const userName = new UserName('John Michael Doe');
      expect(userName.getLastName()).toBe('Doe');
    });

    it('should return empty string for single names', () => {
      const userName = new UserName('John');
      expect(userName.getLastName()).toBe('');
    });
  });

  describe('getInitials', () => {
    it('should return initials for full name', () => {
      const userName = new UserName('John Doe');
      expect(userName.getInitials()).toBe('JD');
    });

    it('should return initials for multiple names', () => {
      const userName = new UserName('John Michael Doe');
      expect(userName.getInitials()).toBe('JMD');
    });

    it('should return single initial for single name', () => {
      const userName = new UserName('John');
      expect(userName.getInitials()).toBe('J');
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const userName1 = new UserName('John Doe');
      const userName2 = new UserName('John Doe');
      expect(userName1.equals(userName2)).toBe(true);
    });

    it('should return false for different names', () => {
      const userName1 = new UserName('John Doe');
      const userName2 = new UserName('Jane Doe');
      expect(userName1.equals(userName2)).toBe(false);
    });
  });
});
