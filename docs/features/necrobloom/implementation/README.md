# NecroBloom Implementation README

## Overview
NecroBloom is a "Gothic Plant Tracker" designed to identify houseplants, provide AI-driven care instructions, and monitor plant health through "Vitality Reports." It leverages the PixelGrim design system for a themed, immersive experience.

## Feature Scope
- Plant identification via photo upload (Gemini 3 Flash).
- User collection management (Cosmos DB).
- Care plan generation (AI).
- Health monitoring (AI Vitality Reports).

## Technical Stack
- **Frontend**: React + Vite SPA (`apps/necrobloom`).
- **Backend**: Kotlin Azure Functions (`apps/necrobloom/api`).
- **Identity**: Microsoft Entra ID.
- **Data**: Azure Cosmos DB (NoSQL) & Azure Blob Storage.
- **AI**: Gemini 3 Flash Preview API.

## Project Structure
- `apps/necrobloom/src/`: React frontend.
- `apps/necrobloom/api/`: Kotlin backend.
- `docs/features/necrobloom/implementation/`: Design and structure documentation.
