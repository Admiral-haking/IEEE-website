// MongoDB initialization script for security
db = db.getSiblingDB('hippogriff');

// Create application user with limited privileges
db.createUser({
  user: 'hippogriff_user',
  pwd: process.env.MONGO_APP_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'hippogriff'
    }
  ]
});

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('solutions');
db.createCollection('blogposts');
db.createCollection('jobs');
db.createCollection('casestudies');
db.createCollection('capabilities');
db.createCollection('events');
db.createCollection('news');
db.createCollection('teammembers');
db.createCollection('staticpages');
db.createCollection('stats');

// Create indexes for performance and security
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: 1 });

db.solutions.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.solutions.createIndex({ published: 1, locale: 1 });
db.solutions.createIndex({ category: 1, locale: 1 });

db.blogposts.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.blogposts.createIndex({ published: 1, locale: 1 });
db.blogposts.createIndex({ tags: 1, locale: 1 });

db.jobs.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.jobs.createIndex({ published: 1, locale: 1 });
db.jobs.createIndex({ type: 1, locale: 1 });

db.casestudies.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.casestudies.createIndex({ published: 1, locale: 1 });

db.capabilities.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.capabilities.createIndex({ locale: 1 });

db.events.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.events.createIndex({ published: 1, locale: 1 });
db.events.createIndex({ date: 1, locale: 1 });

db.news.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.news.createIndex({ published: 1, locale: 1 });

db.teammembers.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.teammembers.createIndex({ published: 1, locale: 1 });

db.staticpages.createIndex({ slug: 1, locale: 1 }, { unique: true });
db.staticpages.createIndex({ locale: 1 });

db.stats.createIndex({ date: 1 }, { unique: true });

print('Database initialization completed successfully');
