#!/bin/bash

# Finnminn Local Environment Bootstrapper
# This script ensures all emulators and configurations are ready for development.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Finnminn Local Environment Bootstrapper...${NC}"

# 1. Check for Docker
if command -v docker &> /dev/null && docker ps &> /dev/null; then
    echo -e "${GREEN}✓ Docker is running. Starting emulators via Docker Compose...${NC}"
    docker compose up -d
else
    echo -e "${RED}✗ Docker is not running or not installed.${NC}"
    echo -e "${YELLOW}Attempting to start Azurite manually (Cosmos DB will not be available)...${NC}"
    if lsof -ti:10000 &> /dev/null; then
        echo -e "${GREEN}✓ Azurite is already running on port 10000.${NC}"
    else
        nohup azurite > azurite.log 2>&1 &
        echo -e "${GREEN}✓ Azurite started in background (logs: azurite.log).${NC}"
    fi
fi

# 2. Check for local.settings.json in Pip
echo -e "${YELLOW}Checking Pip API configuration...${NC}"
if [ ! -f "apps/pip/api/local.settings.json" ]; then
    if [ -f "apps/pip/api/local.settings.example.json" ]; then
        cp apps/pip/api/local.settings.example.json apps/pip/api/local.settings.json
        echo -e "${GREEN}✓ Created apps/pip/api/local.settings.json from example.${NC}"
    fi
else
    echo -e "${GREEN}✓ apps/pip/api/local.settings.json already exists.${NC}"
fi

# Credential audit for Pip
if [ -f "apps/pip/api/local.settings.json" ]; then
    pip_cosmos=$(grep -o '"COSMOS_ENDPOINT"[[:space:]]*:[[:space:]]*"[^"]*"' apps/pip/api/local.settings.json | grep -v 'localhost' || true)
    if [ -n "$pip_cosmos" ]; then
        echo -e "${RED}⚠ WARNING: apps/pip/api/local.settings.json contains a non-localhost COSMOS_ENDPOINT.${NC}"
        echo -e "${RED}  This file may be pointing at production. Reset it with:${NC}"
        echo -e "  ${YELLOW}cp apps/pip/api/local.settings.example.json apps/pip/api/local.settings.json${NC}"
    fi
fi

# 3. Check for .env in Necrobloom
echo -e "${YELLOW}Checking Necrobloom frontend configuration...${NC}"
if [ ! -f "apps/necrobloom/.env" ]; then
    if [ -f "apps/necrobloom/.env.example" ]; then
        cp apps/necrobloom/.env.example apps/necrobloom/.env
        echo -e "${GREEN}✓ Created apps/necrobloom/.env from example.${NC}"
    fi
else
    echo -e "${GREEN}✓ apps/necrobloom/.env already exists.${NC}"
fi

# Credential audit for Necrobloom frontend .env
if [ -f "apps/necrobloom/.env" ]; then
    nb_api_url=$(grep -o 'VITE_API_URL=http://localhost:[0-9]*' apps/necrobloom/.env || true)
    if [ -n "$nb_api_url" ]; then
        echo -e "${RED}⚠ WARNING: apps/necrobloom/.env has VITE_API_URL set to a localhost port.${NC}"
        echo -e "${RED}  This bypasses the Vite proxy and breaks auth header injection.${NC}"
        echo -e "${RED}  Reset with: ${YELLOW}cp apps/necrobloom/.env.example apps/necrobloom/.env${NC}"
    fi
fi

# 5. Check for local.settings.json in Necrobloom
echo -e "${YELLOW}Checking Necrobloom API configuration...${NC}"
if [ ! -f "apps/necrobloom/api/local.settings.json" ]; then
    if [ -f "apps/necrobloom/api/local.settings.example.json" ]; then
        cp apps/necrobloom/api/local.settings.example.json apps/necrobloom/api/local.settings.json
        echo -e "${GREEN}✓ Created apps/necrobloom/api/local.settings.json from example.${NC}"
    fi
else
    echo -e "${GREEN}✓ apps/necrobloom/api/local.settings.json already exists.${NC}"
fi

# Credential audit for Necrobloom
if [ -f "apps/necrobloom/api/local.settings.json" ]; then
    nb_cosmos=$(grep -o '"COSMOS_ENDPOINT"[[:space:]]*:[[:space:]]*"[^"]*"' apps/necrobloom/api/local.settings.json | grep -v 'localhost' || true)
    nb_storage=$(grep -o '"STORAGE_CONNECTION_STRING"[[:space:]]*:[[:space:]]*"[^"]*"' apps/necrobloom/api/local.settings.json | grep 'core\.windows\.net' || true)
    if [ -n "$nb_cosmos" ] || [ -n "$nb_storage" ]; then
        echo -e "${RED}⚠ WARNING: apps/necrobloom/api/local.settings.json contains production endpoint(s).${NC}"
        [ -n "$nb_cosmos" ]   && echo -e "${RED}  - COSMOS_ENDPOINT is not localhost${NC}"
        [ -n "$nb_storage" ]  && echo -e "${RED}  - STORAGE_CONNECTION_STRING points to core.windows.net${NC}"
        echo -e "${RED}  Reset with:${NC}"
        echo -e "  ${YELLOW}cp apps/necrobloom/api/local.settings.example.json apps/necrobloom/api/local.settings.json${NC}"
    fi
fi

# 6. SSL Certificate Management
if lsof -ti:8081 &> /dev/null; then
    echo -e "${YELLOW}Attempting to automate Cosmos SSL certificate import...${NC}"
    openssl s_client -connect 127.0.0.1:8081 </dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > emulator.cer
    if [ -s "emulator.cer" ]; then
        echo -e "${GREEN}✓ Downloaded emulator.cer.${NC}"
        if [ -n "$JAVA_HOME" ]; then
            keytool -importcert -alias cosmos-emulator-$(date +%s) -file emulator.cer -keystore "$JAVA_HOME/lib/security/cacerts" -storepass changeit -noprompt &> /dev/null
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✓ Successfully imported certificate to Java truststore.${NC}"
            else
                echo -e "${RED}✗ Failed to import certificate automatically (may need sudo).${NC}"
                echo -e "Run: ${GREEN}sudo keytool -importcert -alias cosmos-emulator -file emulator.cer -keystore \$JAVA_HOME/lib/security/cacerts -trustcacerts${NC}"
            fi
        fi
        rm emulator.cer
    fi
fi

echo -e "${GREEN}Done! Your local environment is being prepared.${NC}"
echo -e "To start the app, run: ${YELLOW}npm run dev -- --filter=pip${NC}"
