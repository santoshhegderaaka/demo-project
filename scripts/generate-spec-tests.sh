#!/bin/bash
set -e

# -----------------------------
# Preconditions
# -----------------------------
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Tokens not provided"
  echo "Usage: ./generate-spec-tests-copilot.sh <COPILOT_TOKEN> <PUSH_TOKEN>"
  exit 1
fi

COPILOT_TOKEN="$1"
PUSH_TOKEN="$2"

# -----------------------------
# Login using $1 (Copilot / Read)
# -----------------------------
echo "Logging in with Copilot token..."
gh auth logout -h github.com -y || true
echo "$COPILOT_TOKEN" | gh auth login --with-token
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

