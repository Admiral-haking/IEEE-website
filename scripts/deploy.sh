#!/bin/bash

# Hippogriff Security Deployment Script
set -e

echo "🚀 Starting Hippogriff Security Deployment..."

# Configuration
DOMAIN="${DOMAIN:-localhost}"
EMAIL="${EMAIL:-admin@example.com}"
ENV_FILE="${ENV_FILE:-.env.docker}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    print_error "Environment file $ENV_FILE not found. Please copy env.docker.example to $ENV_FILE and configure it."
    exit 1
fi

# Generate secrets if not set
print_status "Generating secrets..."

# Generate JWT secrets
if ! grep -q "JWT_SECRET=" "$ENV_FILE" || grep -q "your-super-secure-jwt-secret-here-change-this" "$ENV_FILE"; then
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" "$ENV_FILE"
    print_status "Generated JWT_SECRET"
fi

if ! grep -q "JWT_REFRESH_SECRET=" "$ENV_FILE" || grep -q "your-super-secure-jwt-refresh-secret-here-change-this" "$ENV_FILE"; then
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
    sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET/" "$ENV_FILE"
    print_status "Generated JWT_REFRESH_SECRET"
fi

# Generate database passwords
if ! grep -q "MONGO_ROOT_PASSWORD=" "$ENV_FILE" || grep -q "your_strong_root_password" "$ENV_FILE"; then
    MONGO_ROOT_PASSWORD=$(openssl rand -base64 32)
    sed -i "s/MONGO_ROOT_PASSWORD=.*/MONGO_ROOT_PASSWORD=$MONGO_ROOT_PASSWORD/" "$ENV_FILE"
    print_status "Generated MONGO_ROOT_PASSWORD"
fi

if ! grep -q "MONGO_APP_PASSWORD=" "$ENV_FILE" || grep -q "your_strong_app_password" "$ENV_FILE"; then
    MONGO_APP_PASSWORD=$(openssl rand -base64 32)
    sed -i "s/MONGO_APP_PASSWORD=.*/MONGO_APP_PASSWORD=$MONGO_APP_PASSWORD/" "$ENV_FILE"
    print_status "Generated MONGO_APP_PASSWORD"
fi

if ! grep -q "REDIS_PASSWORD=" "$ENV_FILE" || grep -q "your_strong_redis_password" "$ENV_FILE"; then
    REDIS_PASSWORD=$(openssl rand -base64 32)
    sed -i "s/REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASSWORD/" "$ENV_FILE"
    print_status "Generated REDIS_PASSWORD"
fi

if ! grep -q "GRAFANA_PASSWORD=" "$ENV_FILE" || grep -q "your_strong_grafana_password" "$ENV_FILE"; then
    GRAFANA_PASSWORD=$(openssl rand -base64 32)
    sed -i "s/GRAFANA_PASSWORD=.*/GRAFANA_PASSWORD=$GRAFANA_PASSWORD/" "$ENV_FILE"
    print_status "Generated GRAFANA_PASSWORD"
fi

# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate for development
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    print_status "Generating self-signed SSL certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"
    print_status "SSL certificate generated"
fi

# Build and start services
print_status "Building Docker images..."
docker-compose --env-file "$ENV_FILE" build

print_status "Starting services..."
docker-compose --env-file "$ENV_FILE" up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check if app is responding
if curl -f -s http://localhost:3000/api/health > /dev/null; then
    print_status "✅ Application is healthy"
else
    print_warning "⚠️  Application health check failed"
fi

# Check if MongoDB is responding
if docker-compose exec -T mongo mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    print_status "✅ MongoDB is healthy"
else
    print_warning "⚠️  MongoDB health check failed"
fi

# Check if Redis is responding
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "✅ Redis is healthy"
else
    print_warning "⚠️  Redis health check failed"
fi

# Display service URLs
print_status "🎉 Deployment completed successfully!"
echo ""
echo "Service URLs:"
echo "  Application: https://localhost"
echo "  Grafana:     http://localhost:3001"
echo "  Prometheus:  http://localhost:9090"
echo ""
echo "Default Grafana credentials:"
echo "  Username: admin"
echo "  Password: $(grep GRAFANA_PASSWORD "$ENV_FILE" | cut -d'=' -f2)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
echo "To restart services: docker-compose restart"
