#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MoneySplit environment configuration...\n');

const envExamplePath = path.join(__dirname, 'env.example');
const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   If you want to overwrite it, delete the existing .env file first.\n');
  process.exit(0);
}

// Check if env.example exists
if (!fs.existsSync(envExamplePath)) {
  console.log('❌ env.example file not found!');
  console.log('   Please ensure env.example exists in the client directory.\n');
  process.exit(1);
}

try {
  // Read the example file
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  
  // Write the .env file
  fs.writeFileSync(envPath, envExample);
  
  console.log('✅ .env file created successfully!');
  console.log('   You can now edit .env to customize your configuration.\n');
  
  console.log('📝 Current configuration:');
  console.log('   NEXT_PUBLIC_API_URL=http://localhost:3000\n');
  
  console.log('💡 Next steps:');
  console.log('   1. Edit .env if you need to change the backend URL');
  console.log('   2. Restart your Next.js development server');
  console.log('   3. Start developing! 🎉\n');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}
