# NecroBloom Design Documentation

## Design Aesthetic: PixelGrim
NecroBloom strictly adheres to the "PixelGrim" design system:
- **Background**: Grape Charcoal (`void`).
- **Primary Accents**: Witchcraft (#7D5FFF) / Radical (#FF0055).
- **Secondary Accents**: Toxic (#00FF41).
- **Typography**: VT323 (Headers), Space Mono (Body).

## UI Components
- **The Vessel Grid**: A list of plants owned by the user, displayed as cards with a gothic frame.
- **The Terminal**: Used for displaying AI-generated care plans and health reports.
- **The Altar (Identification Wizard)**: A multi-step flow for uploading images and confirming identification.

## API Integration
The frontend communicates with Azure Functions via REST. Authentication is handled by passing the Bearer token in the `Authorization` header.

## AI Logic (Gemini 3 Flash Preview)
- **Identify Prompt**: "Identify this plant and provide a structured care plan in JSON format. Include species, lighting needs, and watering frequency."
- **Vitality Prompt**: "Based on this image and previous health reports, evaluate the current health of this plant. Identify any signs of distress (brown leaves, drooping) and suggest immediate care adjustments."

## Persistence Strategy
- **Cosmos DB**: Stores structured metadata for each plant (the "Vessel").
- **Blob Storage**: Stores the images. Each image URL is linked in the Cosmos DB document.
- **Partitioning**: All data is partitioned by `userId` to ensure strict isolation.
