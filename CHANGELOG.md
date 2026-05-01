# Changelog - DogDex

Track all changes, fixes, and improvements introduced in each version of the DogDex project.

## [0.4.0] - 2026-05-01

### Added
- **Real-time Chat System**: Full implementation of the messaging backend and frontend, including unread message counters and real-time socket integration (Closes #14).
- **App Update Checker**: Implementation of a version verification system that notifies users about mandatory updates (Closes #11).
- **Adoption Map & Lifecycle**: Implementation of advanced filtering for points of interest and dog adoption tracking (Closes #6).
- **UI Architecture Standard**: Enforced modular folder structure (`index.tsx` + `styles.ts`) across all screens and components (Closes #12).

### Fixed
- **Camera Permission Bug**: Resolved critical issue where "Allow Once" on iOS/Android would break subsequent camera sessions (Closes #13).
- **Onboarding Tour Overlap**: Fixed UI collision between the onboarding tour and navigation elements (Closes #7).

### Improved
- **Version Synchronization**: Unified version tracking between frontend and backend.
- **Backend Transparency**: Removed development fallbacks for more predictable production deployments.

---

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
- **JWT Secret Enforcement**: Eliminated hardcoded fallback secret; server now refuses to start without `JWT_SECRET` defined.
- **CORS Restriction**: Replaced open `cors()` with a whitelist of allowed origins, blocking cross-origin abuse from unknown sites.
- **Auth Rate Limiting**: Added rate limiter (10 req/15min per IP) to login, register, forgot-password and reset-password routes.
- **Analyze Rate Limiting**: Added rate limiter (30 req/15min per IP) to the scanner route, protecting the TensorFlow model from DoS.
- **Social Account Fix**: Replaced plaintext placeholder password with `null` for auto-provisioned social accounts.
- **Anti-Enumeration**: Unified login error responses to prevent attackers from discovering registered emails.
- **XSS Prevention**: Sanitized token parameter in reset password template using `escape-html`.
- **Password Validation**: Added minimum length check to the reset-password endpoint, consistent with other auth routes.
- **Body Parser Hardening**: Reduced JSON/urlencoded payload limit from 50MB to 1MB.
- **Gitignore Update**: Added `.env.local` and `.env.*.local` patterns to prevent accidental secret commits.
- **Debug Log Cleanup**: Removed all debug `console.log` statements that could leak internal URLs and stack traces in production.

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
