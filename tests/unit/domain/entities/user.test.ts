import { User } from 'domain/entities';
import { Email, UserId, UserName } from 'domain/value-objects';

describe('User entity', () => {
  const makeEmail = (addr = 'john.doe@corp.com') => Email.create(addr);

  const makeInvalidEmail = (addr = 'john.doe@bad-corp.com') => Email.create(addr);

  const makeName = (name = 'John Doe') => UserName.create(name);

  test('create() throws exception when email is invalid', () => {
    const email = makeInvalidEmail();
    const name = makeName();

    expect(() => User.create(email, name)).toThrow();
  });



  test('create() generates an id and sets timestamps equally', () => {
    const email = makeEmail();
    const name = makeName();

    const user = User.create(email, name);

    expect(UserId.isValid(user.id.getValue())).toBe(true);
    expect(user.email.equals(email)).toBe(true);
    expect(user.name.equals(name)).toBe(true);
    expect(user.createdAt instanceof Date).toBe(true);
    expect(user.updatedAt instanceof Date).toBe(true);
    expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime());
  });

  test('reconstitute() restores a user from persisted state', () => {
    const id = UserId.generate();
    const email = makeEmail('alice@corp.com');
    const name = makeName('Alice Doe');
    const createdAt = new Date('2020-01-01T00:00:00.000Z');
    const updatedAt = new Date('2020-01-02T00:00:00.000Z');

    const user = User.reconstitute(id, email, name, createdAt, updatedAt);

    expect(user.id.equals(id)).toBe(true);
    expect(user.email.equals(email)).toBe(true);
    expect(user.name.equals(name)).toBe(true);
    expect(user.createdAt.toISOString()).toBe(createdAt.toISOString());
    expect(user.updatedAt.toISOString()).toBe(updatedAt.toISOString());
  });

  test('getters return the expected value objects', () => {
    const email = makeEmail('bob@corp.com');
    const name = makeName('Bob Smith');
    const user = User.create(email, name);

    expect(user.email.getValue()).toBe('bob@corp.com');
    expect(user.name.getValue()).toBe('Bob Smith');
    expect(UserId.isValid(user.id.getValue())).toBe(true);
  });

  test('updateEmail() returns a new User with updated email and timestamp', () => {
    const originalEmail = makeEmail('old@corp.com');
    const name = makeName('Jane Roe');
    const user = User.create(originalEmail, name);

    const newEmail = makeEmail('new@corp.com');
    const updated = user.updateEmail(newEmail);

    // immutability
    expect(user.email.equals(originalEmail)).toBe(true);

    // updated instance
    expect(updated.email.equals(newEmail)).toBe(true);
    expect(updated.name.equals(name)).toBe(true);
    expect(updated.id.equals(user.id)).toBe(true);
    expect(updated.createdAt.getTime()).toBe(user.createdAt.getTime());
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
  });

  test('updateName() returns a new User with updated name and timestamp', () => {
    const email = makeEmail('person@corp.com');
    const originalName = makeName('Original Name');
    const user = User.create(email, originalName);

    const newName = makeName('Updated Name');
    const updated = user.updateName(newName);

    // immutability
    expect(user.name.equals(originalName)).toBe(true);

    // updated instance
    expect(updated.name.equals(newName)).toBe(true);
    expect(updated.email.equals(email)).toBe(true);
    expect(updated.id.equals(user.id)).toBe(true);
    expect(updated.createdAt.getTime()).toBe(user.createdAt.getTime());
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
  });

  test('equals() compares by identity (id)', () => {
    const email = makeEmail('same@corp.com');
    const name = makeName('Same Person');

    const a = User.create(email, name);
    const b = User.reconstitute(a.id, makeEmail('different@corp.com'), makeName('Other Name'), a.createdAt, a.updatedAt);
    const c = User.create(email, name); // different id

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  test('toJSON() serializes primitive values', () => {
    const email = makeEmail('json@corp.com');
    const name = makeName('Json Tester');
    const user = User.create(email, name);

    const json = user.toJSON();

    expect(json.id).toBe(user.id.getValue());
    expect(json.email).toBe('json@corp.com');
    expect(json.name).toBe('Json Tester');
    expect(typeof json.createdAt).toBe('string');
    expect(typeof json.updatedAt).toBe('string');
    expect(new Date(json.createdAt).toISOString()).toBe(user.createdAt.toISOString());
    expect(new Date(json.updatedAt).toISOString()).toBe(user.updatedAt.toISOString());
  });
});
