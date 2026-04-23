# Changelog - DogDex

Track all changes, fixes, and improvements introduced in each version of the DogDex project.

## [0.3.0] - 2026-04-23

### Added
- **Password Recovery Flow**: Implemented a server-side "Redirect Bridge" for mobile deep links (`dogdex://`), bypassing browser security blocks.
- **Supabase Admin Sync**: Backend integration with Supabase `service_role` to synchronize password updates.
- **Hybrid Authentication**: Integration of Supabase Auth with a custom PostgreSQL bridge, allowing Social Login and traditional accounts to coexist.
- **Cloud Sync Engine**: Robust synchronization mechanism that maintains local and cloud history consistency with soft-delete (tombstone) support.
- **Dynamic Profile Management**: New UI for user profile management, featuring avatar fallbacks and conditional security options.

### Security
- **Token Hardening**: Reduced password reset token expiration to 15 minutes and implemented login invalidation.
- **Admin Isolation**: Moved sensitive auth operations to the backend to protect credentials.

### Fixed
- **Environment Management**: Refactored `dev-menu.js` to automatically generate `.env.local`, ensuring the API URL correctly propagates.
- **Android Focus Jumping**: Resolved critical UX issue where inputs would lose focus spontaneously on Android.
- **Form Stability**: Optimized login and registration forms by replacing unstable components.

### Improved
- **UX & Anti-Spam**: Polished `ProfileModal` loading with ActivityIndicator and added click-prevention to all auth buttons.

### Removed
- **Manual Backup & Restore**: Removed the legacy JSON-based export/import functionality.
- **Unused Dependencies**: Cleaned up `expo-sharing` and `expo-document-picker`.

---

## [0.2.1] - 2026-04-20

### Added
- **Interactive Build System**: Developer script that allows interactive selection between Localhost and Production backends during the Android build process.

### Improved
- **Environment Management**: Centralized API URL logic in `app.config.js`, removing hardcoded values from `.env` to prevent environment leaking.
- **Development Workflow**: Automated backend detection for local development builds.

---

## [0.2.0] - 2026-04-19

### Added
- **User Identification**: Support for sending Name and Email in error reports and suggestions.
- **E2E Testing Infrastructure**: Implementation of an automated testing suite with Playwright to ensure the stability of the support flow.
- **Integration Tests**: JUnit-style backend tests to validate email sending logic and security.
- **Global Audio Control**: Implemented a "Master Mute" feature that centralizes and persists audio preferences for both voice and sound effects.

### Fixed
- **Security (XSS)**: Implemented input sanitization with HTML character escaping to prevent script injection in support emails.
- **Header Injection**: Fixed a vulnerability that allowed SMTP header manipulation via the email field.

### Security
- **Rate Limiting**: Limitation of 5 requests per 15 minutes per IP on the support route to prevent spam.
- **Upload Hardening**: Restriction of uploads to files of maximum 1MB and strict format validation (JPG/PNG only).

---

## [0.1.0] - 2026-04-19

### Added
- **DogDex App**: Launch of the first functional version built with Expo and React Native.
- **AI Mechanism**: Integration with TensorFlow.js model for real-time dog breed classification.
- **Camera**: Functionality to capture dog photos for AI analysis.
- **Gallery (Support)**: Ability to select images from the library to attach to technical reports.
- **Support System**: Creation of a basic form for sending technical reports.
- **Backend API**: Express server configured for image processing and reporting.
- **Shared Package**: Shared library of TypeScript interfaces to ensure consistency between frontend and backend.
- **Premium Design**: Modern interface with native Dark Mode support and smooth animations.
