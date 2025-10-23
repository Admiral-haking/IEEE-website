#!/usr/bin/env node

/**
 * Database Connection Test Script
 * This script tests the database connection and basic operations
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Database connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hippogriff-website';

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log(`📍 MongoDB URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Connect to database
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      retryWrites: true,
      retryReads: true,
    });
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Test basic operations
    const db = mongoose.connection.db;
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📚 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('Collections:');
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    }
    
    // Test a simple query
    try {
      const User = mongoose.model('User', new mongoose.Schema({
        email: String,
        name: String,
        role: String
      }));
      
      const userCount = await User.countDocuments();
      console.log(`👥 Users in database: ${userCount}`);
    } catch (error) {
      console.log('ℹ️ User collection not found or accessible');
    }
    
    // Get database stats
    const stats = await db.stats();
    console.log(`📊 Database size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Collections: ${stats.collections}`);
    console.log(`📊 Documents: ${stats.objects}`);
    
    console.log('✅ Database connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure MongoDB is running');
      console.log('2. Check if the connection string is correct');
      console.log('3. For Docker: run "docker-compose up mongo"');
      console.log('4. For local: start MongoDB service');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication tips:');
      console.log('1. Check your MongoDB credentials');
      console.log('2. Verify the database name in the connection string');
      console.log('3. Make sure the user has proper permissions');
    }
    
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Handle script execution
if (require.main === module) {
  testConnection().catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { testConnection };
