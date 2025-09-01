# Architecture Overview

This document outlines the high-level architecture of the application.

## Platform Constraint

**This application is designed and configured to run exclusively on macOS.**

All development, testing, and packaging efforts are targeted solely for the macOS platform. There is no support for Windows or Linux.

## Core Components

The application follows the standard Electron process model, which consists of three main components:

1.  **Main Process (`src/main`)**:
    -   The entry point of the application.
    -   Runs in a Node.js environment.
    -   Responsible for creating and managing application windows (`BrowserWindow`).
    -   Handles all operating system interactions.

2.  **Renderer Process (`src/renderer`)**:
    -   The user interface of the application.
    -   Runs in a sandboxed Chromium environment.
    -   Built with React and styled with Tailwind CSS.
    -   Cannot directly access Node.js APIs for security reasons.

3.  **Preload Script (`src/preload`)**:
    -   A secure bridge between the Main and Renderer processes.
    -   Runs in a privileged context with access to a limited set of Node.js APIs.
    -   Exposes specific, secure APIs to the Renderer process via the `contextBridge`.

4.  **Shared Code (`src/shared`)**:
    -   A directory for code that is shared between different processes.
    -   Contains reusable utilities, type definitions, and constants.
    -   Ensures consistency and reduces code duplication between the Main, Preload, and Renderer processes.

## Process Communication

-   Communication between the Main and Renderer processes is handled securely via Inter-Process Communication (IPC) channels, which will be implemented using tRPC.
-   The Preload script is crucial for maintaining the security boundary between the sandboxed renderer and the powerful main process.

## User Experience (UX)

The application must provide a user experience that feels native to macOS. This is a core architectural principle that influences technology and design choices.

-   **Adherence to Apple's Human Interface Guidelines (HIG)**: All UI components, interactions, and visual design should align with the established conventions of macOS to ensure the application feels familiar and intuitive to users of the platform.
-   **Native-Like Controls and Patterns**: Where possible, UI elements will be styled and behave like standard macOS controls (e.g., buttons, sidebars, traffic-light window controls).
-   **Performance**: The application must be responsive and performant, meeting the expectations for a native desktop application.
-   **System Integrations**: The application will leverage native macOS features where appropriate (e.g., Application Menu, notifications).
