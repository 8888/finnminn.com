# Implementation: Cryptid Console Developer Page

This feature implements User Story 8, adding a dedicated "Cryptid Console" page to the `apps/web` application for developer tools and configuration.

## Overview

The "Cryptid Console" serves as a hidden/internal utility page for developers. The primary initial use case is to provide easy access to the MSAL Bearer token for use in external tools like `curl`.

## Technical Goals

- **Secure Access:** Ensure the page is only accessible to authenticated users.
- **Design Alignment:** Strictly follow the "PixelGrim" design system using `@finnminn/ui`.
- **Utility:** Implement a "Token Syphon" tool for viewing and copying the API token.
- **Navigation:** Integrate the page into the existing application launcher.

## Key Components

1.  **Console Page (`Console.tsx`):** The main container for developer utilities.
2.  **Token Syphon:** A specific tool within the console for token management.
3.  **AppLauncher Update:** Integration of the console link into the dashboard navigation.

## Setup & Access

The page will be located at `/console`. Access is managed by the `AuthProvider` React context.
