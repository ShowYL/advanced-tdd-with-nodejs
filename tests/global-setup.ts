import { GenericContainer } from 'testcontainers';

export default async function globalSetup() {
  console.log('🚀 Starting global test setup...');
  
  // Global setup for TestContainers
  // This runs once before all tests
  
  console.log('✅ Global test setup completed');
}
