import 'reflect-metadata';
import { container } from './shared/container.js';

// Phase 1 - Foundation Setup Complete
// This is the main entry point for the application

async function main() {
  console.log('🚀 Advanced TDD with Node.js - Clean Architecture');
  console.log('📋 Phase 1: Foundation Setup Complete');
  console.log('');
  console.log('✅ Project Structure Created');
  console.log('✅ TypeScript Configuration');
  console.log('✅ Jest with TestContainers Setup');
  console.log('✅ TSyringe Dependency Injection');
  console.log('✅ Domain Layer (Entities, Value Objects, Repository Interfaces)');
  console.log('✅ Comprehensive Unit Tests');
  console.log('');
  console.log('🔄 Next: Phase 2 - Core Features (Use Cases, Repository Implementations)');
  
  // Example of using our domain objects
  try {
    const { User, Email, UserName } = await import('./domain/index.js');
    
    const email = Email.create('john.doe@example.com');
    const name = UserName.create('John Doe');
    const user = User.create(email, name);
    
    console.log('');
    console.log('🧪 Domain Objects Test:');
    console.log('User created:', user.toJSON());
    
  } catch (error) {
    console.error('❌ Error testing domain objects:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
