#!/bin/bash
# Push EIDU Hokeja Totalizators to GitHub
# Run this from project root: bash push_to_github.sh

set -e

echo "🚀 Pushing EIDU Hokeja Totalizators to GitHub..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run 'git init' first."
    exit 1
fi

# Get current status
echo "📊 Current git status:"
git status --short | head -20
echo ""

# Stage all changes
echo "📝 Staging all changes..."
git add .

# Check what will be committed
echo ""
echo "📋 Files to be committed:"
git diff --cached --name-only | head -20
echo ""

# Commit
COMMIT_MESSAGE="Production release: Hockey prediction game with automated cron jobs, Google Sheets integration, and leaderboard

Features:
- Main predictions page with game list and score input
- Leaderboard (Kopvērtējums) with player rankings
- Automated 7 PM cron: Fetch tomorrow's games and send email reminder
- Automated 11 PM cron: Fetch game results and update scores
- Player history and detailed scoring
- Latvian UI with country flags
- Google Sheets API integration for data persistence

Infrastructure:
- Next.js 14 with TypeScript
- Vercel serverless deployment
- Google Sheets as database
- Gmail API for email notifications
- Cron jobs for automated updates

Data syncing:
- Fixed Speles sheet with sequential match_id (1-12)
- Updated Prognozes predictions to match new format
- Kopvertejums leaderboard auto-calculated
"

echo "💬 Committing with message..."
git commit -m "$COMMIT_MESSAGE" || echo "ℹ️  Nothing new to commit"

# Get origin
ORIGIN=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$ORIGIN" ]; then
    echo ""
    echo "❌ No remote 'origin' configured."
    echo ""
    echo "To set up GitHub remote, run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/eidu-hokeja-totalizators.git"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Determine branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo ""
echo "🌿 Current branch: $BRANCH"
echo "🔗 Remote: $ORIGIN"
echo ""

# Push
echo "⬆️  Pushing to GitHub..."
git push -u origin $BRANCH

echo ""
echo "✅ Push complete!"
echo ""
echo "📊 Verify at: ${ORIGIN%.git}"
