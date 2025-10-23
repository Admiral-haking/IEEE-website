#!/bin/bash

# SSL Setup Script for Hippogriff Application
# This script sets up SSL certificates using Let's Encrypt and Certbot

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="yourdomain.com"
EMAIL="admin@yourdomain.com"
NGINX_CONFIG="/etc/nginx/sites-available/hippogriff"
NGINX_ENABLED="/etc/nginx/sites-enabled/hippogriff"

echo -e "${GREEN}🔒 Setting up SSL for Hippogriff Application${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}📦 Installing required packages...${NC}"
apt install -y nginx certbot python3-certbot-nginx ufw

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ufw allow 'Nginx Full'
ufw allow ssh
ufw --force enable

# Create nginx configuration
echo -e "${YELLOW}⚙️  Creating nginx configuration...${NC}"
cat > /etc/nginx/sites-available/hippogriff << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Replace placeholder domain
sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/hippogriff

# Enable the site
echo -e "${YELLOW}🔗 Enabling nginx site...${NC}"
ln -sf /etc/nginx/sites-available/hippogriff /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo -e "${YELLOW}🧪 Testing nginx configuration...${NC}"
nginx -t

# Start nginx
echo -e "${YELLOW}🚀 Starting nginx...${NC}"
systemctl start nginx
systemctl enable nginx

# Obtain SSL certificate
echo -e "${YELLOW}🔐 Obtaining SSL certificate...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Setup automatic renewal
echo -e "${YELLOW}🔄 Setting up automatic renewal...${NC}"
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Update nginx configuration with security headers
echo -e "${YELLOW}🛡️  Updating nginx with security headers...${NC}"
cp nginx.conf /etc/nginx/sites-available/hippogriff

# Replace placeholder domain in the new config
sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/hippogriff

# Test and reload nginx
echo -e "${YELLOW}🧪 Testing updated nginx configuration...${NC}"
nginx -t

echo -e "${YELLOW}🔄 Reloading nginx...${NC}"
systemctl reload nginx

# Setup log rotation
echo -e "${YELLOW}📝 Setting up log rotation...${NC}"
cat > /etc/logrotate.d/hippogriff << 'EOF'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 nginx adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
EOF

# Create security monitoring script
echo -e "${YELLOW}📊 Creating security monitoring script...${NC}"
cat > /usr/local/bin/security-monitor.sh << 'EOF'
#!/bin/bash

# Security monitoring script
LOG_FILE="/var/log/security-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check for failed login attempts
FAILED_LOGINS=$(grep "Failed login" /var/log/nginx/access.log | wc -l)
if [ $FAILED_LOGINS -gt 10 ]; then
    echo "$DATE - WARNING: High number of failed login attempts: $FAILED_LOGINS" >> $LOG_FILE
fi

# Check for rate limit violations
RATE_LIMIT_VIOLATIONS=$(grep "429" /var/log/nginx/access.log | wc -l)
if [ $RATE_LIMIT_VIOLATIONS -gt 5 ]; then
    echo "$DATE - WARNING: Rate limit violations detected: $RATE_LIMIT_VIOLATIONS" >> $LOG_FILE
fi

# Check SSL certificate expiry
CERT_EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/yourdomain.com/cert.pem | cut -d= -f2)
CERT_EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( (CERT_EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo "$DATE - WARNING: SSL certificate expires in $DAYS_UNTIL_EXPIRY days" >> $LOG_FILE
fi
EOF

chmod +x /usr/local/bin/security-monitor.sh

# Add security monitoring to crontab
(crontab -l 2>/dev/null; echo "*/15 * * * * /usr/local/bin/security-monitor.sh") | crontab -

echo -e "${GREEN}✅ SSL setup completed successfully!${NC}"
echo -e "${GREEN}🔗 Your application is now available at: https://$DOMAIN${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "   1. Update your DNS records to point to this server"
echo -e "   2. Test your application at https://$DOMAIN"
echo -e "   3. Monitor logs at /var/log/nginx/"
echo -e "   4. Check security monitoring at /var/log/security-monitor.log"
echo -e "   5. SSL certificates will auto-renew via cron job"

echo -e "${GREEN}🎉 Security setup complete!${NC}"
