#!/bin/sh
# Installs Use into /Applications:  curl -fsSL https://arzyevv.github.io/use/install.sh | sh
# Downloads the latest release, replaces any installed copy and opens it. Your tabs, history and
# settings live in ~/Library/Application Support/Use and are not touched.
set -e

if [ "$(uname -s)" != "Darwin" ] || [ "$(uname -m)" != "arm64" ]; then
  echo "Use needs a Mac with Apple Silicon." >&2
  exit 1
fi

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

echo "Downloading Use..."
curl -fsSL -o "$WORK/Use.zip" "https://github.com/arzyevv/use/releases/latest/download/Use.zip"
/usr/bin/ditto -x -k "$WORK/Use.zip" "$WORK"
[ -x "$WORK/Use.app/Contents/MacOS/Use" ] || { echo "The download is not a valid copy of Use." >&2; exit 1; }

# Quit a running copy first so it saves its session.
if pgrep -xq Use; then
  osascript -e 'tell application id "com.arzayevv.use" to quit' >/dev/null 2>&1 || true
  i=0
  while pgrep -xq Use && [ "$i" -lt 50 ]; do i=$((i + 1)); sleep 0.1; done
fi

rm -rf /Applications/Use.app
mv "$WORK/Use.app" /Applications/Use.app
open /Applications/Use.app
echo "Use is installed in Applications."
