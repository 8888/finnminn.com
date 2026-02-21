#!/bin/bash

# Finnminn Local Environment Manager Script
# Usage: ./manage_env.sh [bootstrap|start_backend|start_frontend|cleanup] [app_name]

COMMAND=$1
APP=$2

case $COMMAND in
  bootstrap)
    echo "Bootstrapping environment..."
    npm run bootstrap
    ;;
  start_backend)
    if [ -z "$APP" ]; then echo "App name required"; exit 1; fi
    PORT=7071
    [ "$APP" = "necrobloom" ] && PORT=7072
    echo "Starting backend for $APP on port $PORT..."
    lsof -ti:$PORT || (cd apps/$APP/api && nohup ./gradlew azureFunctionsRun > backend.log 2>&1 &)
    echo "Backend starting in background. Check apps/$APP/api/backend.log"
    ;;
  start_frontend)
    if [ -z "$APP" ]; then echo "App name required"; exit 1; fi
    PORT=5173
    [ "$APP" = "necrobloom" ] && PORT=5174
    [ "$APP" = "web" ] && PORT=5175
    echo "Starting frontend for $APP on port $PORT..."
    lsof -ti:$PORT || nohup npm run dev -- --filter=$APP -- --host localhost > frontend.log 2>&1 &
    echo "Frontend starting in background. Check frontend.log"
    ;;
  start_all)
    echo "Starting full suite..."
    $0 bootstrap
    $0 start_backend pip
    $0 start_backend necrobloom
    $0 start_frontend pip
    $0 start_frontend necrobloom
    $0 start_frontend web
    echo "Full suite starting. Ports: Pip (5173/7071), Necrobloom (5174/7072), Web (5175)"
    ;;
  cleanup)
    echo "Cleaning up local processes..."
    lsof -ti:5171-5175,7071-7075,10000 | xargs kill -9 2>/dev/null
    echo "Cleanup complete."
    ;;
  *)
    echo "Usage: $0 {bootstrap|start_backend|start_frontend|start_all|cleanup} [app_name]"
    exit 1
esac
