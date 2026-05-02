You must execute all terminal commands using PowerShell syntax.

Rules:

* Always generate commands compatible with Windows PowerShell (or PowerShell Core).
* Do NOT use Bash, sh, zsh, or Linux-specific syntax.
* Do NOT use `&&` for command chaining — use PowerShell's `-and` operator or separate commands with `;`
* Use PowerShell cmdlets and conventions (e.g., Get-ChildItem instead of ls, Remove-Item instead of rm).
* Use backticks (`) for line continuation when needed, not backslashes (\).
* Use `$env:VARIABLE` for environment variables (not `$VARIABLE`).
* When performing file or directory operations, use PowerShell-native commands whenever possible.
* Ensure commands are valid and executable in a standard PowerShell terminal.

Before executing any terminal command, verify that it follows PowerShell syntax.

If a command is not compatible with PowerShell, you must convert it before execution.

================================================================
CRITICAL KNOWLEDGE: BACKEND INTEGRATION PATTERNS
================================================================

PRISMA 7 BACKEND:

  - Single source of truth: "schema.prisma"
  - Generates: node_modules/@prisma/client, prisma/client.ts, prisma/adapter-pg.js
  - Environment: `DATABASE_URL` (Postgres)
  - CLI: `npx prisma db push` or `npx prisma db seed` (Node.js env)

TESTING FRAMEWORK:

  - Adapter Pattern:
    - Tests use @prisma/adapter-better-sqlite3
    - In-memory or file-based SQLite
    - Adapter automatically generated at `prisma/adapter-sqlite.js`
  - Test files:
    - `__tests__/setup.ts` -> creates test DB and generates adapter
    - `__tests__/helpers.ts` -> test prisma client singleton
    - Integration tests run via `jest --runInBand`

SYNC INTEGRATION:

  - Backend must handle both remote and offline data:
    - Remote: `status === "synced"` → fetch from server
    - Offline:
      - `status === "pending"` → local-only, upload on reconnect
      - `status === "deleted"` → soft-delete/hide, remove on sync
  - Sync logic:
    - Check for pending/deleted items on app startup
    - Upload pending items to server
    - Reconcile deleted items with server state
    - Merge local changes with remote data

CRITICAL SECURITY:

  - Never hardcode tokens or secrets in code
  - Use environment variables only: `process.env.DB_URL`, `process.env.JWT_SECRET`
  - All user data protected by: Password, JWT, Social Auth
  - Social provider tokens never stored on server (only provider-specific IDs)

ARCHITECTURE RULES:

  - No direct DB access in React Native code (only via API)
  - All authentication flows MUST go through:
    - `/auth/register`
    - `/auth/login`
    - `/auth/social-login`
  - Test database created dynamically at runtime
  - Tests never commit generated adapter files to git

================================================================
UI ARCHITECTURE PATTERN:
================================================================

  - Modular Standard: All screens and complex components MUST be organized in subdirectories.
  - Structure:
    - `Folder/index.tsx`: Component logic and JSX.
    - `Folder/styles.ts`: Modular styles using `StyleSheet.create`.
  - Guidelines:
    - NO inline `StyleSheet.create` inside `index.tsx`.
    - Styles MUST be exported as `styles` constant from `styles.ts`.
    - Shared design tokens (colors, spacing) should be imported from global constants if available.
    - Component logic remains focused on behavior; visuals reside in the style module.

When making changes:

1. Run `npx prisma db push` to update schema
2. Run `npx prisma generate` if needed
3. Run `npm run test:auth` and `npm run test:sync`
4. Verify adapter regeneration at `prisma/adapter-sqlite.js`
5. Verify sync endpoints work with test data

================================================================
REMOTE REPOSITORY INTERACTION
================================================================

  - Always use the GitHub CLI (`gh`) for remote operations:
    - Issues: `gh issue list`, `gh issue view <number>`, `gh issue create`
    - Pull Requests: `gh pr create`, `gh pr checkout`, `gh pr status`
    - Repository info: `gh repo view`
  - Do not use direct git remote commands unless necessary for low-level plumbing.
  - Ensure `gh` is authenticated before attempting operations.

================================================================
SEMANTIC COMMIT WORKFLOW:
================================================================

  - All commits MUST be grouped by semantic meaning following the Conventional Commits pattern.
  - Types:
    - `feat:`: New features (e.g., implementing chat system).
    - `refactor:`: Code changes that neither fix a bug nor add a feature (e.g., style modularization).
    - `fix:`: Bug fixes.
    - `docs:`: Documentation only changes (including agent.md updates).
    - `chore:`: Changes to the build process or auxiliary tools and libraries.
  - Process:
    1. Group files that belong to the same semantic context.
    2. Use `git add <specific_files>` instead of `git add .`.
    3. Commit each group with a clear, concise message.
    4. Avoid bulk commits that mix unrelated changes.
