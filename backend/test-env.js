import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

console.log('🔍 Testing environment variable loading...\n');
console.log('Current directory:', __dirname);
console.log('.env path:', envPath);
console.log('.env exists:', existsSync(envPath));

if (existsSync(envPath)) {
  console.log('\n📄 .env file contents (first 5 lines):');
  const content = readFileSync(envPath, 'utf8');
  const lines = content.split('\n').slice(0, 10);
  lines.forEach((line, i) => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      console.log(`  ${i + 1}. ${key}=...`);
    }
  });
}

console.log('\n🔧 Loading with dotenv...');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error:', result.error.message);
} else {
  console.log('✅ Loaded successfully!');
}

console.log('\n📊 Environment variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Not found');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Found' : '❌ Not found');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

if (process.env.MONGODB_URI) {
  console.log('\n✅ SUCCESS: Environment variables are working!');
  console.log('You can now run: npm run dev');
} else {
  console.log('\n❌ PROBLEM: MONGODB_URI not loaded');
  console.log('Please check your .env file');
}
