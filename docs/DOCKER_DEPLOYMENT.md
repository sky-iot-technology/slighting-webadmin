# Docker Deployment Guide

This guide explains how to deploy the Next.js dashboard application to a VPS server using Docker Compose.

## Prerequisites

- A VPS server with Docker and Docker Compose installed
- Domain name (optional, but recommended)
- SSH access to your VPS

## Installation Steps

### 1. Install Docker and Docker Compose on VPS

If Docker is not already installed, run these commands on your VPS:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2. Prepare Your Project

#### Option A: Clone from Git Repository

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Navigate to your desired directory
cd /opt  # or any directory you prefer

# Clone your repository
git clone <your-repository-url> next-dashboard
cd next-dashboard
```

#### Option B: Upload Project Files

```bash
# On your local machine, create a tarball
tar -czf project.tar.gz --exclude='node_modules' --exclude='.next' .

# Upload to VPS
scp project.tar.gz user@your-vps-ip:/opt/

# On VPS, extract
ssh user@your-vps-ip
cd /opt
tar -xzf project.tar.gz -C next-dashboard
cd next-dashboard
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .docker-compose.env.example .env.production

# Edit the environment file
nano .env.production
```

Fill in all required values:
- `NEXT_PUBLIC_API_URL`: Your API endpoint URL
- `NEXTAUTH_URL`: Your application's public URL
- `NEXTAUTH_SECRET`: Generate a strong secret (you can use: `openssl rand -base64 32`)
- `NEXT_PUBLIC_API_KEY_GOONGMAP`: Your Goong Map API key
- Sentry configuration (if using)

### 4. Build and Start the Application

```bash
# Build and start the containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check container status
docker-compose ps
```

### 5. Set Up Reverse Proxy (Nginx) - Recommended

Install Nginx:

```bash
sudo apt install nginx -y
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/next-dashboard
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
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
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/next-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Set Up SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure Nginx and set up auto-renewal
```

### 7. Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already configured)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

## Management Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 -f
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Update Application

```bash
# Pull latest changes (if using Git)
git pull origin main  # or your branch name

# Rebuild and restart
docker-compose up -d --build

# Or force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Check Container Status

```bash
# List running containers
docker-compose ps

# Check resource usage
docker stats

# Execute commands in container
docker-compose exec app sh
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Check if port 3000 is already in use
sudo lsof -i :3000

# Verify environment variables
docker-compose config
```

### Build fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Application not accessible

1. Check if container is running: `docker-compose ps`
2. Check application logs: `docker-compose logs app`
3. Verify Nginx configuration: `sudo nginx -t`
4. Check firewall: `sudo ufw status`
5. Verify port binding: `sudo netstat -tlnp | grep 3000`

### Out of memory issues

If your VPS has limited RAM, you can:

1. Add swap space:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

2. Optimize Docker build by reducing build stages or using build cache

## Performance Optimization

### Enable Docker BuildKit

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### Use Multi-stage Build Cache

The Dockerfile already uses multi-stage builds for optimal image size.

### Monitor Resources

```bash
# Monitor container resources
docker stats

# Check disk usage
docker system df
```

## Backup and Recovery

### Backup Environment Variables

```bash
# Backup .env.production
cp .env.production .env.production.backup
```

### Backup Application Data

If you have any persistent data, ensure it's in a Docker volume:

```yaml
volumes:
  - app-data:/app/data
```

## Security Best Practices

1. **Never commit `.env.production`** to version control
2. **Use strong secrets** for `NEXTAUTH_SECRET`
3. **Keep Docker updated**: `sudo apt update && sudo apt upgrade docker.io`
4. **Regularly update base images** in Dockerfile
5. **Use non-root user** (already configured in Dockerfile)
6. **Enable firewall** and only open necessary ports
7. **Use SSL/TLS** for all production deployments
8. **Regular backups** of environment configuration

## Production Checklist

- [ ] Docker and Docker Compose installed
- [ ] Environment variables configured (`.env.production`)
- [ ] Application builds successfully
- [ ] Container starts and runs
- [ ] Application accessible on port 3000
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Domain DNS configured
- [ ] Monitoring/logging set up
- [ ] Backup strategy in place

## Support

For issues related to:
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **Docker**: Check [Docker Documentation](https://docs.docker.com/)
- **Nginx**: Check [Nginx Documentation](https://nginx.org/en/docs/)

