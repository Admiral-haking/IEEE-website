#!/usr/bin/env node

/**
 * Simple Database Setup Script
 * This script sets up the database with basic configuration
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Please set it in your .env.local file.');
  process.exit(1);
}

// Define schemas directly in the script
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['member', 'user', 'admin'], default: 'user' },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String },
  backupCodes: [{ type: String }],
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  excerpt: { type: String },
  contentHtml: { type: String, required: true },
  coverFileId: { type: String },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  author: { type: String, required: true },
  locale: { type: String, required: true, default: 'en' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

const SolutionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String, required: true },
  summary: { type: String, required: true },
  contentHtml: { type: String, required: true },
  coverFileId: { type: String },
  features: [{ type: String }],
  technologies: [{ type: String }],
  published: { type: Boolean, default: false },
  locale: { type: String, required: true, default: 'en' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Create models
const User = mongoose.model('User', UserSchema);
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
const Solution = mongoose.model('Solution', SolutionSchema);

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // 1. Create Admin User
    const adminEmail = 'admin@hippogriff.com';
    const adminPassword = 'admin123'; // CHANGE THIS IN PRODUCTION!
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        email: adminEmail,
        name: 'Admin User',
        passwordHash: hashedPassword,
        role: 'admin',
        mfaEnabled: false,
      });
      console.log(`✅ Admin user created: ${adminUser.email}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminUser.email}`);
      // Update password if it's the default one
      const isCurrentPassword = await bcrypt.compare(adminPassword, adminUser.passwordHash);
      if (!isCurrentPassword) {
        adminUser.passwordHash = hashedPassword;
        await adminUser.save();
        console.log('✅ Admin user password updated');
      }
    }

    // 2. Seed Sample Solutions
    const solutionCount = await Solution.countDocuments();
    if (solutionCount === 0) {
      await Solution.create([
        {
          title: 'Advanced Software Development',
          slug: 'advanced-software-development',
          category: 'software',
          summary: 'Cutting-edge software solutions for modern businesses.',
          contentHtml: '<p>Detailed content about advanced software development...</p>',
          features: ['Custom Development', 'API Integration', 'Performance Optimization'],
          technologies: ['React', 'Node.js', 'MongoDB'],
          published: true,
          locale: 'en',
        },
        {
          title: 'توسعه نرم‌افزار پیشرفته',
          slug: 'tosee-narm-afzar-pishrafte',
          category: 'software',
          summary: 'راه‌حل‌های نرم‌افزاری پیشرفته برای کسب‌وکارهای مدرن.',
          contentHtml: '<p>محتوای دقیق درباره توسعه نرم‌افزار پیشرفته...</p>',
          features: ['توسعه سفارشی', 'یکپارچه‌سازی API', 'بهینه‌سازی عملکرد'],
          technologies: ['React', 'Node.js', 'MongoDB'],
          published: true,
          locale: 'fa',
        },
      ]);
      console.log('✅ Sample solutions seeded');
    } else {
      console.log('ℹ️  Solutions already exist, skipping seeding');
    }

    // 3. Seed Sample Blog Posts
    const blogPostCount = await BlogPost.countDocuments();
    if (blogPostCount === 0) {
      await BlogPost.create([
        {
          title: 'Welcome to Our Blog',
          slug: 'welcome-to-our-blog',
          excerpt: 'A warm welcome to all our readers!',
          contentHtml: '<p>This is our first blog post. Stay tuned for more updates!</p>',
          coverFileId: null,
          tags: ['welcome', 'news'],
          published: true,
          author: adminUser.name,
          locale: 'en',
        },
        {
          title: 'به وبلاگ ما خوش آمدید',
          slug: 'khosh-amadid-be-weblog',
          excerpt: 'خوش آمدید به همه خوانندگان عزیز!',
          contentHtml: '<p>این اولین پست وبلاگ ماست. منتظر به‌روزرسانی‌های بیشتر باشید!</p>',
          coverFileId: null,
          tags: ['خوش_آمدید', 'اخبار'],
          published: true,
          author: adminUser.name,
          locale: 'fa',
        },
      ]);
      console.log('✅ Sample blog posts seeded');
    } else {
      console.log('ℹ️  Blog posts already exist, skipping seeding');
    }

    // 4. Create indexes (with error handling for existing indexes)
    try {
      await User.collection.createIndex({ email: 1 }, { unique: true });
      console.log('✅ User email index created');
    } catch (error) {
      if (error.code === 86) {
        console.log('ℹ️  User email index already exists');
      } else {
        throw error;
      }
    }

    try {
      await BlogPost.collection.createIndex({ slug: 1, locale: 1 }, { unique: true });
      console.log('✅ BlogPost slug+locale index created');
    } catch (error) {
      if (error.code === 86) {
        console.log('ℹ️  BlogPost slug+locale index already exists');
      } else {
        throw error;
      }
    }

    try {
      await Solution.collection.createIndex({ slug: 1, locale: 1 }, { unique: true });
      console.log('✅ Solution slug+locale index created');
    } catch (error) {
      if (error.code === 86) {
        console.log('ℹ️  Solution slug+locale index already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   👤 Admin user: ${adminEmail}`);
    console.log(`   🔑 Password: ${adminPassword}`);
    console.log(`   📊 Solutions: ${await Solution.countDocuments()}`);
    console.log(`   📝 Blog posts: ${await BlogPost.countDocuments()}`);
    console.log(`   👥 Total users: ${await User.countDocuments()}`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

setupDatabase();
