#!/usr/bin/env bash
set -e

# ---------------------------------------------------------
# GitHub Copilot test generation (LOCAL ONLY)
# Jenkins / CI will skip this script automatically
# ---------------------------------------------------------

if [ "$CI" = "true" ]; then
  echo "CI environment detected. Skipping Copilot test generation."
  exit 0
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) not found. Please install gh."
  exit 1
fi

if ! gh copilot --help >/dev/null 2>&1; then
  echo "GitHub Copilot CLI not installed."
  echo "Run: gh extension install github/gh-copilot"
  exit 1
fi

echo "Generating Jest .spec.js files using GitHub Copilot..."

SRC_DIR="src"
TEST_DIR="tests"

mkdir -p "$TEST_DIR"

# Find all JS source files except existing test files
find "$SRC_DIR" -type f -name "*.js" ! -name "*.spec.js" | while read -r srcFile; do

  # Convert src path → tests path
  specFile=$(echo "$srcFile" \
    | sed "s|^$SRC_DIR|$TEST_DIR|" \
    | sed "s|\.js$|\.spec.js|")

  # Skip if test already exists
  if [ -f "$specFile" ]; then
    echo "Skipping existing test: $specFile"
    continue
  fi

  mkdir -p "$(dirname "$specFile")"

  echo "Generating: $specFile"

  gh copilot suggest "
Generate Jest unit tests for this Node.js JavaScript file.

Rules:
- Use jest
- Mock external dependencies
- Cover success, failure, and edge cases
- Use describe and it blocks
- Output ONLY valid JavaScript code
- No markdown, no explanations

Source code:
$(cat "$srcFile")
" --language javascript > "$specFile"

done

echo "AI test generation completed successfully."
