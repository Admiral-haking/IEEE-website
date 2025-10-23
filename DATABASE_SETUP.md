# Database Setup Guide

This guide will help you set up and configure the MongoDB database for the Hippogriff website.

## Prerequisites

- Node.js 18+ installed
- MongoDB 7.0+ (local or Docker)
- npm or yarn package manager

## Quick Start

### 1. Environment Configuration

Create a `.env.local` file in the project root with the following content:

```bash
# Copy from env.example and modify as needed
cp env.example .env.local
```

Required environment variables:

```env
# JWT Secrets - Generate strong secrets using: openssl rand -base64 32
JWT_SECRET=your-super-secure-jwt-secret-here-change-this-in-production
JWT_REFRESH_SECRET=your-super-secure-jwt-refresh-secret-here-change-this-in-production

# MongoDB Connection String
MONGODB_URI=mongodb://127.0.0.1:27017/hippogriff-website

# Environment
NODE_ENV=development
```

### 2. Database Setup Options

#### Option A: Using Docker (Recommended)

1. Start MongoDB with Docker:
```bash
docker-compose up mongo -d
```

2. Initialize the database:
```bash
npm run db:init
```

#### Option B: Local MongoDB Installation

1. Install MongoDB locally
2. Start MongoDB service
3. Initialize the database:
```bash
npm run db:init
```

### 3. Verify Setup

Test the database connection:
```bash
npm run db:test
```

## Database Structure

The application uses the following collections:

### Core Collections

- **users** - User accounts and authentication
- **solutions** - Software solutions and services
- **blogposts** - Blog articles and posts
- **jobs** - Job listings and opportunities
- **casestudies** - Case studies and projects
- **capabilities** - Company capabilities and skills
- **events** - Events and workshops
- **news** - News and announcements
- **teammembers** - Team member profiles
- **staticpages** - Static page content
- **stats** - Statistics and metrics

### Indexes

The database includes optimized indexes for:
- Email uniqueness (users)
- Slug + locale uniqueness (content)
- Published status filtering
- Category and tag filtering
- Date-based sorting

## Database Management

### Admin Panel

Access the database management interface at:
```
http://localhost:3000/admin/database
```

Features:
- Real-time health monitoring
- Document counts by collection
- Index status
- Database initialization
- Connection diagnostics

### API Endpoints

- `GET /api/database/health` - Database health check
- `POST /api/database/init` - Initialize database (admin only)

### Scripts

Available npm scripts:

```bash
# Test database connection
npm run db:test

# Setup database with indexes and sample data
npm run db:setup

# Complete initialization (setup + verification)
npm run db:init
```

## Sample Data

The initialization script creates:

### Default Admin User
- **Email**: admin@hippogriff.com
- **Password**: admin123
- **Role**: admin

⚠️ **Important**: Change these credentials after first login!

### Sample Content
- Software development solution (EN/FA)
- Welcome blog post
- Sample job listing
- Basic statistics

## Troubleshooting

### Connection Issues

**Error**: `ECONNREFUSED`
- **Solution**: Ensure MongoDB is running
- **Docker**: `docker-compose up mongo -d`
- **Local**: Start MongoDB service

**Error**: `authentication failed`
- **Solution**: Check MongoDB credentials in connection string
- **Verify**: Database name and user permissions

### Performance Issues

**Slow queries**:
- Check if indexes are created: `npm run db:test`
- Recreate indexes: Use admin panel initialization

**Memory usage**:
- Monitor with MongoDB Compass
- Check connection pool settings

### Data Issues

**Missing collections**:
- Run database initialization: `npm run db:init`
- Check admin panel for collection status

**Corrupted data**:
- Restore from backup
- Reinitialize database (⚠️ will delete existing data)

## Security Considerations

### Production Setup

1. **Change default credentials**:
   - Update admin user password
   - Generate strong JWT secrets
   - Use environment-specific MongoDB credentials

2. **Network security**:
   - Use MongoDB authentication
   - Enable SSL/TLS connections
   - Restrict network access

3. **Backup strategy**:
   - Regular automated backups
   - Test restore procedures
   - Monitor backup integrity

### Environment Variables

Required for production:
```env
NODE_ENV=production
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin
JWT_SECRET=strong-secret-here
JWT_REFRESH_SECRET=strong-refresh-secret-here
```

## Monitoring

### Health Checks

The application includes built-in health monitoring:

- Connection status
- Document counts
- Index status
- Performance metrics

### Logging

Database operations are logged with:
- Connection events
- Query performance
- Error tracking
- Security events

## Backup and Recovery

### Backup Commands

```bash
# Full database backup
mongodump --uri="mongodb://localhost:27017/hippogriff-website" --out=./backup

# Specific collection backup
mongodump --uri="mongodb://localhost:27017/hippogriff-website" --collection=users --out=./backup
```

### Restore Commands

```bash
# Full database restore
mongorestore --uri="mongodb://localhost:27017/hippogriff-website" ./backup/hippogriff-website

# Specific collection restore
mongorestore --uri="mongodb://localhost:27017/hippogriff-website" --collection=users ./backup/hippogriff-website/users.bson
```

## Support

For database-related issues:

1. Check the health endpoint: `/api/database/health`
2. Review application logs
3. Test connection: `npm run db:test`
4. Use admin panel diagnostics

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Next.js Database Integration](https://nextjs.org/docs/basic-features/data-fetching)
