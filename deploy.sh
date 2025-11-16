#!/bin/bash

# Docker Deployment Script for Next.js Dashboard
# This script helps deploy the application to a VPS

set -e

echo "🚀 Starting deployment process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found!"
    echo "📝 Creating .env.production from example..."
    if [ -f .docker-compose.env.example ]; then
        cp .docker-compose.env.example .env.production
        echo "✅ Created .env.production. Please edit it with your configuration."
        echo "   Run: nano .env.production"
        exit 1
    else
        echo "❌ .docker-compose.env.example not found. Please create .env.production manually."
        exit 1
    fi
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Remove old images (optional, uncomment if you want to force rebuild)
# echo "🧹 Cleaning up old images..."
# docker-compose down --rmi all || true

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Wait for container to be ready
echo "⏳ Waiting for application to start..."
sleep 5

# Check container status
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Container status:"
    docker-compose ps
    echo ""
    echo "📝 View logs with: docker-compose logs -f"
    echo "🌐 Application should be available at: http://localhost:3000"
else
    echo "❌ Deployment failed. Check logs with: docker-compose logs"
    exit 1
fi

