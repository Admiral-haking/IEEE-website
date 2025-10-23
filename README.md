# IEEE Website Project 🚀

[![CI/CD](https://github.com/Admiral-haking/IEEE-website/actions/workflows/ci.yml/badge.svg)](https://github.com/Admiral-haking/IEEE-website/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19.0-green)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

A modern, full-stack Next.js application built for IEEE organizations with comprehensive admin panel, multilingual support, and advanced security features.

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX**: Built with Material-UI and custom components
- **Multilingual Support**: English and Persian (RTL) support
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Rich Text Editor**: TipTap-based editor with full formatting capabilities
- **Visual Effects**: Laser flow, pixel blast, glitch text, and more
- **Theme Support**: Dark/Light mode with RTL support

### 🔧 Backend
- **RESTful API**: Complete API with authentication and authorization
- **Database Integration**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with MFA support
- **Security**: CSRF protection, rate limiting, security monitoring
- **File Management**: GridFS for media storage
- **Real-time Features**: WebSocket support for live updates

### 🛡️ Security
- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control (RBAC)
- **Security Headers**: CSP, HSTS, and other security headers
- **Rate Limiting**: API rate limiting and DDoS protection
- **Input Validation**: Comprehensive input sanitization
- **Security Monitoring**: Real-time security event logging

### 🐳 DevOps
- **Docker Support**: Complete containerization with Docker Compose
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: Prometheus metrics and health checks
- **SSL/TLS**: Automated SSL certificate management
- **Nginx**: Reverse proxy with security configurations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Admiral-haking/IEEE-website.git
   cd IEEE-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/en/admin

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── (admin)/       # Admin panel routes
│   │   ├── (auth)/        # Authentication routes
│   │   └── (main)/        # Main application routes
│   └── api/               # API routes
├── components/             # Reusable React components
├── layouts/               # Layout components
├── lib/                   # Utility libraries
├── models/                # Database models
├── server/                # Server-side services
├── views/                  # Page components
└── locales/               # Internationalization files
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ieee` |
| `JWT_SECRET` | JWT signing secret | Required |
| `NEXTAUTH_SECRET` | NextAuth secret | Required |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |

### Database Setup

The application includes automated database setup:

```bash
# Initialize database with sample data
npm run db:setup

# Test database connection
npm run db:test
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:setup     # Setup database
npm run db:test      # Test database connection
npm run security-check # Run security audit
```

### Code Style

- **ESLint**: Configured with Next.js recommended rules
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (recommended)

## 🚀 Deployment

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

### Automated Deployment

The project includes deployment scripts:

- **Linux/macOS**: `scripts/deploy.sh`
- **Windows**: `scripts/deploy.ps1`

### GitHub Actions

CI/CD pipeline includes:
- ✅ Code linting and type checking
- ✅ Security vulnerability scanning
- ✅ Automated testing
- ✅ Build verification
- ✅ Deployment to staging/production

## 🔒 Security

### Security Features
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: API rate limiting
- **Security Headers**: Comprehensive security headers
- **Input Validation**: Zod-based validation
- **SQL Injection Prevention**: Parameterized queries

### Security Checklist
- [ ] Change default passwords
- [ ] Configure SSL/TLS certificates
- [ ] Set up security monitoring
- [ ] Review and update dependencies
- [ ] Configure firewall rules

## 🌐 Internationalization

The application supports multiple languages:
- **English** (LTR)
- **Persian** (RTL)

### Adding New Languages

1. Create locale files in `src/locales/[language]/`
2. Add language configuration in `src/i18n/index.ts`
3. Update language toggle component

## 📊 Monitoring

### Health Checks
- Application health: `/api/health`
- Database health: `/api/database/health`
- Security monitoring: `/api/security/monitor`

### Metrics
- Prometheus metrics endpoint
- Custom application metrics
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow security guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/Admiral-haking/IEEE-website/issues)
- **Security**: Report security issues privately

## 🏆 Acknowledgments

- Next.js team for the amazing framework
- Material-UI for the component library
- MongoDB for the database solution
- All contributors and supporters

---

**Made with ❤️ for IEEE organizations worldwide**