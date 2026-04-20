# Changelog - DogDex

Track all changes, fixes, and improvements introduced in each version of the DogDex project.

## [0.2.0] - In Development

### Added
- **User Identification**: Support for sending Name and Email in error reports and suggestions.
- **E2E Testing Infrastructure**: Implementation of an automated testing suite with Playwright to ensure the stability of the support flow.
- **Integration Tests**: JUnit-style backend tests to validate email sending logic and security.

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
