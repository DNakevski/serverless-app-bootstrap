#!/bin/bash

# ** Decide on the app name **

# If the calling process already set the APP_NAME env var then just use it
if [ -n "$APP_NAME" ]; then
  echo "Using pre-set APP_NAME for app name"
# Otherwise if an argument was passed when this script was called then use that as the suffix of the app name
elif [ "$#" -gt 0 ]; then
  APP_NAME="serverless-app-$1"
# Otherwise use the local username as the app name suffix (THIS WON'T WORK ON WINDOWS - THERE IS NO SHORT USERNAME)
elif [ -n "$USER" ]; then
  APP_NAME="serverless-app-${USER}"
# Otherwise fail
else
  echo "Usage: ./deploy.sh APP_NAME, e.g. run \"./deploy.sh alice\" to deploy the serverless-app-alice app"
  exit 1
fi

deployParams=("--context" "appName=$APP_NAME" "--all")

# If calling process has set NO_HOTSWAP to anything, then DON'T hotswap, otherwise DO hotswap
# NB - don't use hotswap in production
if [ -z "$NO_HOTSWAP" ]; then
  deployParams+=( "--hotswap")
fi

# Bash settings to protect against various errors
set -euo pipefail

yarn run deploy "${deployParams[@]}"
