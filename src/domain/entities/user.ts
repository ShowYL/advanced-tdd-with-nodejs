import { Entity } from '../../shared/types/common.js';
import { UserId } from '../value-objects/user-id.js';
import { Email } from '../value-objects/email.js';
import { UserName } from '../value-objects/user-name.js';

export interface UserProps {
  id: UserId;
  email: Email;
  name: UserName;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements Entity<UserId> {
  private constructor(private readonly props: UserProps) {}

  public static create(
    email: Email,
    name: UserName,
    id?: UserId
  ): User {
    const now = new Date();
    return new User({
      id: id || UserId.generate(),
      email,
      name,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstitute(props: UserProps): User {
    return new User(props);
  }

  // Getters
  public get id(): UserId {
    return this.props.id;
  }

  public get email(): Email {
    return this.props.email;
  }

  public get name(): UserName {
    return this.props.name;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  public updateEmail(newEmail: Email): User {
    return new User({
      ...this.props,
      email: newEmail,
      updatedAt: new Date(),
    });
  }

  public updateName(newName: UserName): User {
    return new User({
      ...this.props,
      name: newName,
      updatedAt: new Date(),
    });
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
