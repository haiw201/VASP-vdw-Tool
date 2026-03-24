#!/bin/bash

# Git Initialization Script for VASP vdw Replacer
# Usage: bash init-git.sh

set -e

echo "🔧 Initializing Git repository for VASP vdw Replacer..."

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if already a git repository
if [ -d ".git" ]; then
  echo "⚠️  This directory is already a Git repository."
  read -p "Do you want to reinitialize? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
  rm -rf .git
fi

# Initialize Git repository
echo "[1/6] Initializing Git repository..."
git init
git config user.name "VASP vdw Replacer Contributors"
git config user.email "contributors@example.com"

# Create .gitignore
echo "[2/6] Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
*/package-lock.json

# Build outputs
dist/
build/
*.exe

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
ehthumbs.db
Desktop.ini

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Test
coverage/
.nyc_output/

# Temporary files
*.tmp
*.bak
*.orig
*.temp

# Lock files (we'll regenerate them)
package-lock.json

# VASP files (user data)
INCAR*
POTCAR*
KPOINTS*
POSCAR*
EOF

# Create initial commit
echo "[3/6] Creating initial commit..."
git add .
git commit -m "Initial commit: VASP vdw Replacer

Features:
- Web interface for vdw functional selection
- CLI tool for batch processing
- Support for 25+ vdw correction methods
- Cross-platform (Windows/Linux)
- Based on VASP official documentation

Main components:
- Backend: Express.js API server
- Frontend: React + TypeScript web interface
- CLI: Command-line tool for batch processing"

# Create development branch
echo "[4/6] Creating development branch..."
git branch develop

# Show status
echo "[5/6] Git repository status:"
git status

# Show branches
echo ""
echo "[6/6] Branches:"
git branch -a

echo ""
echo "✅ Git repository initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Create a repository on GitHub"
echo "2. Add remote: git remote add origin https://github.com/username/vasp-vdw-replacer.git"
echo "3. Push: git push -u origin main"
echo "4. Push develop branch: git push -u origin develop"
echo ""
echo "To release on Zenodo:"
echo "1. Create a release on GitHub"
echo "2. Zenodo will automatically create a DOI"
echo "3. Update CITATION.cff with your DOI"
