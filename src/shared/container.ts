import 'reflect-metadata';
import { container } from 'tsyringe';

// Dependency injection container configuration
// This file will be extended as we add more dependencies

export { container };

// Token constants for dependency injection
export const TOKENS = {
  // Repository tokens
  USER_REPOSITORY: Symbol.for('UserRepository'),
  PRODUCT_REPOSITORY: Symbol.for('ProductRepository'),
  
  // Service tokens
  EMAIL_SERVICE: Symbol.for('EmailService'),
  LOGGER_SERVICE: Symbol.for('LoggerService'),
} as const;
