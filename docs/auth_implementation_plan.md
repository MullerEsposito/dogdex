# Implementation Plan: Authentication & Cloud Sync (Issue #4)

This plan details the implementation of a secure authentication system and cloud backup for DogDex, allowing users to save their collections and access them from anywhere.

## Proposed Changes

### [Component] Shared Types
- **[MODIFY] [index.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/shared/src/index.ts)**: Add `User`, `AuthResponse`, and `SyncPayload` interfaces for type-safe communication.

### [Component] Backend (Cloud Infrastructure)

#### Infrastructure Setup
- **[NEW] [schema.prisma](file:///c:/Users/User/Developer/UniPDS/dogdex/backend/prisma/schema.prisma)**: Define `User` and `DogEntry` models.
- **[NEW] [supabase.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/backend/src/services/supabase.ts)**: Initialize Supabase client for image storage.
- **[MODIFY] [server.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/backend/src/server.ts)**: Integrate Prisma client and export it for use in controllers.

#### Logic & Routes
- **[NEW] [auth.middleware.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/backend/src/middlewares/auth.ts)**: Implement JWT verification logic.
- **[NEW] [authController.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/backend/src/controllers/authController.ts)**: Registration (bcrypt hashing) and Login (JWT generation).
- **[NEW] [syncController.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/backend/src/controllers/syncController.ts)**: Handling batch uploads of local records and fetching cloud history.
- **[NEW] [auth.routes.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/backend/src/routes/auth.routes.ts)**: Authentication endpoints.
- **[NEW] [sync.routes.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/backend/src/routes/sync.routes.ts)**: Protected synchronization endpoints.

### [Component] App (Frontend & Sync Logic)

#### Auth & Security
- **[NEW] [useAuth.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/app/hooks/useAuth.ts)**: Manage authentication state, login/register calls, and token persistence with `expo-secure-store`.
- **[NEW] [AuthScreen.tsx](file:///c:/Users/User/Developer/UniPDS/dogdex/app/app/auth.tsx)**: UI for Login and Account Creation.

#### Storage & Sync Integration
- **[MODIFY] [useDogdexStorage.ts](file:///c:/Users/User/Developer/UniPDS/dogdex/app/hooks/useDogdexStorage.ts)**: 
    - Update `saveEntry` to detect if a user is logged in.
    - If logged in, automatically trigger a background sync to the cloud.
    - Implement a `syncOfflineRecords` function to push data when a user eventually registers.
- **[MODIFY] [dogdex.tsx](file:///c:/Users/User/Developer/UniPDS/dogdex/app/app/dogdex.tsx)**: Add a "Cloud Sync Status" indicator and a login prompt for anonymous users.

---

## Open Questions

- **Supabase Credentials**: I will set up the `.env` template for `SUPABASE_URL` and `SUPABASE_KEY`.
- **Cloud Migration**: The app will force-sync ALL local history to the cloud immediately upon registration (User confirmed).

---

## Verification Plan

### Automated Tests
- **Backend**: New Jest tests for registration, login, and protected sync routes.
- **E2E**: Playwright tests to verify:
    1. Anonymous scan works.
    2. Registration flow success.
    3. Scanned dog appears in cloud list after sync.

### Manual Verification
- Verify successful image upload to Supabase Storage Bucket.
- Verify JWT expiration forces a re-login after the configured time.
