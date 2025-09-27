export default async function globalTeardown() {
  console.log('🧹 Starting global test teardown...');
  
  // Global teardown for TestContainers
  // This runs once after all tests
  
  console.log('✅ Global test teardown completed');
}
