import { Entity } from '../../shared/types/common.js';
import { UserId } from '../value-objects/user-id.js';
import { Email } from '../value-objects/email.js';
import { UserName } from '../value-objects/user-name.js';


// inspiration: https://medium.com/@ezequiel/immutability-and-builders-with-typescript-b69a51c94e8c

export class User implements Entity<UserId> {
  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly name: UserName,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static create(
    email: Email,
    name: UserName,
    id?: UserId
  ): User {
    const now = new Date();
    return new User(id || UserId.generate(), email, name, now, now);
  }

  public static reconstitute(
    id: UserId,
    email: Email,
    name: UserName,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(id, email, name, createdAt, updatedAt);
  }

  // Public readonly fields (no getters)

  // Business methods (immutable updates)
  public updateEmail(newEmail: Email): User {
    return new User(
      this.id,
      newEmail,
      this.name,
      this.createdAt,
      new Date()
    );
  }

  public updateName(newName: UserName): User {
    return new User(
      this.id,
      this.email,
      newName,
      this.createdAt,
      new Date()
    );
  }

  public equals(other: Entity<UserId>): boolean {
    if (!(other instanceof User)) {
      return false;
    }
    return this.id.equals(other.id);
  }

  public toJSON() {
    return {
      id: this.id.getValue(),
      email: this.email.getValue(),
      name: this.name.getValue(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
