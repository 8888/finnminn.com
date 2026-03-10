#!/bin/bash

# Finnminn Local Environment Manager Script
# Usage: ./manage_env.sh [bootstrap|start_backend|start_frontend|start_all|wait_for_ready|cleanup] [app_name]

COMMAND=$1
APP=$2

# Standard log directory
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

wait_for_port() {
  local port=$1
  local name=$2
  local timeout=60
  local count=0
  echo "Waiting for $name on port $port..."
  until lsof -ti:"$port" > /dev/null; do
    sleep 2
    count=$((count + 2))
    if [ $count -ge $timeout ]; then
      echo "Timeout waiting for $name on port $port"
      return 1
    fi
  done
  echo "$name is ready on port $port"
  return 0
}

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
    if lsof -ti:$PORT > /dev/null; then
      echo "Backend already running on port $PORT"
    else
      (cd apps/$APP/api && nohup ./gradlew azureFunctionsRun > "../../../logs/backend-$APP.log" 2>&1 &)
      echo "Backend starting in background. Check $LOG_DIR/backend-$APP.log"
    fi
    ;;
  start_frontend)
    if [ -z "$APP" ]; then echo "App name required"; exit 1; fi
    PORT=5173
    [ "$APP" = "necrobloom" ] && PORT=5174
    [ "$APP" = "web" ] && PORT=5175
    [ "$APP" = "eventhorizon" ] && PORT=5176
    echo "Starting frontend for $APP on port $PORT..."
    if lsof -ti:$PORT > /dev/null; then
      echo "Frontend already running on port $PORT"
    else
      nohup npm run dev -- --filter=$APP -- --host localhost > "$LOG_DIR/frontend-$APP.log" 2>&1 &
      echo "Frontend starting in background. Check $LOG_DIR/frontend-$APP.log"
    fi
    ;;
  start_all)
    echo "Starting full suite..."
    $0 bootstrap
    $0 start_backend pip
    $0 start_backend necrobloom
    $0 start_frontend pip
    $0 start_frontend necrobloom
    $0 start_frontend web
    $0 start_frontend eventhorizon
    echo "Full suite commands issued. Verifying readiness..."
    $0 wait_for_ready
    ;;
  wait_for_ready)
    echo "Verifying service readiness..."
    # Check backends
    wait_for_port 7071 "Pip Backend" || exit 1
    wait_for_port 7072 "Necrobloom Backend" || exit 1
    # Check frontends
    wait_for_port 5173 "Pip Frontend" || exit 1
    wait_for_port 5174 "Necrobloom Frontend" || exit 1
    wait_for_port 5175 "Web Frontend" || exit 1
    wait_for_port 5176 "EventHorizon Frontend" || exit 1
    echo "All services are ready for interaction."
    ;;
  cleanup)
    echo "Cleaning up local processes..."
    # Kill common port-bound processes
    lsof -ti:5171-5176,7071-7075,10000 | xargs kill -9 2>/dev/null
    
    # Kill any lingering tail -f processes from this script
    ps aux | grep "tail -f" | grep -E "backend.log|frontend.log|turbo_dev.log" | awk '{print $2}' | xargs kill -9 2>/dev/null

    # Stop Gradle daemons for each API app to free up memory and ports
    [ -f apps/pip/api/gradlew ] && (cd apps/pip/api && ./gradlew --stop)
    [ -f apps/necrobloom/api/gradlew ] && (cd apps/necrobloom/api && ./gradlew --stop)
    
    echo "Cleanup complete."
    ;;
  *)
    echo "Usage: $0 {bootstrap|start_backend|start_frontend|start_all|wait_for_ready|cleanup} [app_name]"
    exit 1
esac
