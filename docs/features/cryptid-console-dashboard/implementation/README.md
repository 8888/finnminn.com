# Implementation: Cryptid Console Dashboard

This feature implements User Story 6, transforming the private application section (`/app`) into a multi-functional dashboard following the "Cryptid Console" design system.

## Overview

The current `/app/index.html` is a single-card layout. This implementation will expand it to a full-dashboard experience including:
- A sticky top navigation bar.
- An "App Launcher" grid for external tools.
- A "Tool Box" for utility functions like API token retrieval.

## Technical Goals

- **Modular UI:** Structure the dashboard into logical sections (Header, Sidebar/Grid, Launcher, Tools).
- **Design Consistency:** Strict adherence to `styleguide.toml`.
- **Enhanced Utility:** Provide quick access to tokens and external micro-apps.

## Key Components

1. **TopBar:** Persistent header with user info and logout.
2. **AppLauncher:** Grid of interactive tiles linking to `n-dim` and `pip` subdomains.
3. **UtilityToolBox:** Functional component for interacting with the backend (via tokens).
