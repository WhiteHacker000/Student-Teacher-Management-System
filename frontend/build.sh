#!/bin/bash
set -e

echo "Building frontend..."
npm install
npm run build

echo "Copying server files..."
cp server-package.json dist/package.json
cp server.js dist/

echo "Build complete!"
