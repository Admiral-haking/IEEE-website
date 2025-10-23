#!/usr/bin/env node

/**
 * Script to generate secure secrets for the application
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Generating secure secrets for Hippogriff Engineering Website...\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(32).toString('base64');
console.log('JWT Secret:');
console.log(jwtSecret);
console.log('\n');

// Generate MongoDB connection string template
const mongoTemplate = 'mongodb://username:password@localhost:27017/hippogriff-website';
console.log('MongoDB URI Template:');
console.log(mongoTemplate);
console.log('\n');

// Create .env.local content
const envContent = `# Generated on ${new Date().toISOString()}
# Copy this content to your .env.local file

# JWT Secret - Generated secure secret
JWT_SECRET=${jwtSecret}

# MongoDB Connection String
# Replace username, password, and host with your actual values
MONGODB_URI=${mongoTemplate}

# Environment
NODE_ENV=development

# Optional: Add other environment variables as needed
# GOOGLE_ANALYTICS_ID=your-ga-id
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
`;

// Write to .env.local if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with secure secrets!');
  console.log('📝 Please update MONGODB_URI with your actual database credentials.');
} else {
  console.log('⚠️  .env.local already exists. Not overwriting.');
  console.log('📝 Please manually add the JWT_SECRET to your existing .env.local file:');
  console.log(`JWT_SECRET=${jwtSecret}`);
}

console.log('\n🔒 Security reminders:');
console.log('- Never commit .env.local to version control');
console.log('- Use strong, unique secrets in production');
console.log('- Enable HTTPS in production');
console.log('- Regularly rotate your secrets');
console.log('- Monitor your application for security issues');

console.log('\n✨ Setup complete! You can now run: npm run dev');
