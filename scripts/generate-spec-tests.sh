#!/bin/bash
set -e

# -----------------------------
# Preconditions
# -----------------------------
if [ -z "$1" ]; then
  echo "GitHub token not provided"
  echo "Usage: ./generate-spec-tests-copilot.sh <GITHUB_TOKEN>"
  exit 1
fi

# -----------------------------
# GitHub Auth
# -----------------------------
echo "$1" | gh auth login --with-token
gh auth status

# -----------------------------
# Install Copilot CLI
# -----------------------------
npm install -g @github/copilot
copilot -v

# -----------------------------
# Config
# -----------------------------
SRC_DIR="src"
TEST_DIR="test"

mkdir -p "$TEST_DIR"

# -----------------------------
# Generate tests
# -----------------------------
find "$SRC_DIR" -type f -name "*.js" ! -name "*.test.js" ! -name "*.spec.js" | while read -r FILE
do
  REL_PATH="${FILE#$SRC_DIR/}"
  TEST_FILE="$TEST_DIR/${REL_PATH%.js}.spec.js"

  mkdir -p "$(dirname "$TEST_FILE")"

  echo "----------------------------------------"
  echo "Source: $FILE"
  echo "Test:   $TEST_FILE"
  echo "----------------------------------------"

  copilot -p "
Project uses Node.js and Jest.

Source file: $FILE
Target test file: $TEST_FILE

Task:
- Generate Jest unit tests
- Mock all external dependencies
- Do not modify production code
- Write tests directly to the target test file
- Use describe/it blocks
- Ensure tests are runnable via 'npm test'
" --allow-tool write || echo "Copilot failed for $FILE"

done

echo "Test generation attempt completed"

# -----------------------------
# Git commit & push
# -----------------------------
echo "Checking for git changes..."

if [ -n "$(git status --porcelain)" ]; then
  echo "Changes detected. Committing..."

  git add test/

  git commit -m "test: auto-generate Jest spec files using Copilot"

  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  echo "Pushing to branch: $CURRENT_BRANCH"

  git push origin "$CURRENT_BRANCH"

  echo "Changes committed and pushed successfully"
else
  echo "No changes to commit"
fi
