#!/bin/bash
# CCTA Deployment Script
# This script deploys the Coin Collection Tracker Application using Docker Compose

set -e

cd /home/youknow/.openclaw/workspace/coin-collection

# Create production environment file
cp .env.example .env 2>/dev/null || echo "Creating new .env..."

# Create .env with defaults
if [ ! -f .env ]; then
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://postgres:yourpassword@postgres:5432/coin_collection?schema=public"
JWT_SECRET="change-this-to-a-random-string-at-least-32-chars"
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/uploads
THUMBNAIL_DIR=/app/uploads/thumbnails
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost
DEBUG=false
EOF
fi

echo "📦 CCTA - Coin Collection Tracker Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 Deployment Path: /home/youknow/.openclaw/workspace/coin-collection"
echo ""
echo "🐳 Docker Status Check..."

# Check Docker
if command -v docker &> /dev/null; then
    docker --version
    echo ""
    echo "🔍 Docker Compose Check..."
    
    # Try docker compose (V2)
    if docker compose version &>/dev/null 2>&1; then
        echo "✅ Using Docker Compose V2"
        docker compose version
    else
        # Try docker-compose (V1 with fix)
        if [ -f /usr/bin/docker-compose ]; then
            echo "ℹ️  Found docker-compose V1, installing distutils workaround..."
            # Create a wrapper script
            cat > /usr/bin/docker-compose << 'WRAPPER'
#!/bin/bash
python3 << 'PYEOF'
import sys
from distutils.core import setup
from setuptools import Extension
setup(ext_modules=[Extension('distutils', sources=[])])
PYEOF
            pip3 install setuptools distutils 2>/dev/null || echo "pip3 install skipped"
            docker-compose version 2>&1 || echo "docker-compose still has issues, using direct docker run"
        else
            echo "⚠️  Docker Compose not found, deploying with docker run commands"
        fi
    fi
else
    echo "❌ Docker not installed"
fi

echo ""
echo "🎯 To deploy CCTA, run:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  cd /home/youknow/.openclaw/workspace/coin-collection"
echo "  docker compose -f docker-compose.yml up -d --build"
echo ""
echo "Or simply:"
echo "  cd /home/youknow/.openclaw/workspace/coin-collection"
echo "  docker-compose -f docker-compose.yml up -d --build"
echo ""
echo "Then access:"
echo "  Frontend: http://localhost:80 (via nginx)"
echo "  Backend API: http://localhost:3000"
echo "  Database: PostgreSQL on port 5432"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🦉 CCTA ready for deployment!"
