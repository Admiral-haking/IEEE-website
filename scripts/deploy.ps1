# Hippogriff Security Deployment Script for Windows
param(
    [string]$Domain = "localhost",
    [string]$Email = "admin@example.com",
    [string]$EnvFile = ".env.docker"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Status "🚀 Starting Hippogriff Security Deployment..."

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed. Please install Docker Desktop first."
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

# Check if environment file exists
if (-not (Test-Path $EnvFile)) {
    Write-Error "Environment file $EnvFile not found. Please copy env.docker.example to $EnvFile and configure it."
    exit 1
}

# Generate secrets if not set
Write-Status "Generating secrets..."

# Generate JWT secrets
$envContent = Get-Content $EnvFile -Raw
if ($envContent -match "JWT_SECRET=your-super-secure-jwt-secret-here-change-this" -or $envContent -notmatch "JWT_SECRET=") {
    $jwtSecret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $envContent = $envContent -replace "JWT_SECRET=.*", "JWT_SECRET=$jwtSecret"
    Write-Status "Generated JWT_SECRET"
}

if ($envContent -match "JWT_REFRESH_SECRET=your-super-secure-jwt-refresh-secret-here-change-this" -or $envContent -notmatch "JWT_REFRESH_SECRET=") {
    $jwtRefreshSecret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $envContent = $envContent -replace "JWT_REFRESH_SECRET=.*", "JWT_REFRESH_SECRET=$jwtRefreshSecret"
    Write-Status "Generated JWT_REFRESH_SECRET"
}

# Generate database passwords
if ($envContent -match "MONGO_ROOT_PASSWORD=your_strong_root_password" -or $envContent -notmatch "MONGO_ROOT_PASSWORD=") {
    $mongoRootPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $envContent = $envContent -replace "MONGO_ROOT_PASSWORD=.*", "MONGO_ROOT_PASSWORD=$mongoRootPassword"
    Write-Status "Generated MONGO_ROOT_PASSWORD"
}

if ($envContent -match "MONGO_APP_PASSWORD=your_strong_app_password" -or $envContent -notmatch "MONGO_APP_PASSWORD=") {
    $mongoAppPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $envContent = $envContent -replace "MONGO_APP_PASSWORD=.*", "MONGO_APP_PASSWORD=$mongoAppPassword"
    Write-Status "Generated MONGO_APP_PASSWORD"
}

if ($envContent -match "REDIS_PASSWORD=your_strong_redis_password" -or $envContent -notmatch "REDIS_PASSWORD=") {
    $redisPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $envContent = $envContent -replace "REDIS_PASSWORD=.*", "REDIS_PASSWORD=$redisPassword"
    Write-Status "Generated REDIS_PASSWORD"
}

if ($envContent -match "GRAFANA_PASSWORD=your_strong_grafana_password" -or $envContent -notmatch "GRAFANA_PASSWORD=") {
    $grafanaPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $envContent = $envContent -replace "GRAFANA_PASSWORD=.*", "GRAFANA_PASSWORD=$grafanaPassword"
    Write-Status "Generated GRAFANA_PASSWORD"
}

# Save updated environment file
Set-Content -Path $EnvFile -Value $envContent

# Create SSL directory
if (-not (Test-Path "nginx/ssl")) {
    New-Item -ItemType Directory -Path "nginx/ssl" -Force
}

# Generate self-signed certificate for development
if (-not (Test-Path "nginx/ssl/cert.pem") -or -not (Test-Path "nginx/ssl/key.pem")) {
    Write-Status "Generating self-signed SSL certificate..."
    # Note: You'll need OpenSSL installed or use PowerShell's New-SelfSignedCertificate
    Write-Warning "Please generate SSL certificates manually or install OpenSSL"
    Write-Warning "For development, you can use: New-SelfSignedCertificate -DnsName $Domain -CertStoreLocation cert:\LocalMachine\My"
}

# Build and start services
Write-Status "Building Docker images..."
docker-compose --env-file $EnvFile build

Write-Status "Starting services..."
docker-compose --env-file $EnvFile up -d

# Wait for services to be ready
Write-Status "Waiting for services to be ready..."
Start-Sleep -Seconds 30

# Check service health
Write-Status "Checking service health..."

# Check if app is responding
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Status "✅ Application is healthy"
    }
} catch {
    Write-Warning "⚠️  Application health check failed"
}

# Display service URLs
Write-Status "🎉 Deployment completed successfully!"
Write-Host ""
Write-Host "Service URLs:"
Write-Host "  Application: https://localhost"
Write-Host "  Grafana:     http://localhost:3001"
Write-Host "  Prometheus:  http://localhost:9090"
Write-Host ""
Write-Host "To view logs: docker-compose logs -f"
Write-Host "To stop services: docker-compose down"
Write-Host "To restart services: docker-compose restart"
