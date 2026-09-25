# UI fixes verification

- Production build: passed (`npm.cmd run build`).
- TypeScript: passed (`npx.cmd tsc --noEmit`).
- ESLint: failed with 100 errors and 39 warnings across the repository (`npm.cmd run lint`). Comparing all 16 changed/new code files with HEAD found no new lint diagnostics.
- Full suite: 216 passed, 16 failed. All remaining failures were present in the baseline; no new failures.
- New behavioral tests cover Unicode name validation, combined task filters across API pages, inclusive date boundaries, pagination, offer presence, and numeric/name-only suburb references.
- Independent review completed; the suburb name/ID mismatch it identified was fixed and regression-tested.
- No authenticated live-browser or live-backend verification was performed.

Filtered task views fetch all listing pages because the repository API reference does not document the admin filters. Large collections may load more slowly; server-side filtering would avoid this cost.

## Existing failing tests

- cancellations page renders the resolution center cancellations dashboard
- chat moderation overview page matches the reference dashboard view
- dispute detail page renders poster and doer dispute tabs with admin actions
- disputes page renders the resolution center disputes dashboard
- payment page renders the payments overview dashboard content
- payment filters expose the requested dropdown option text
- payment page opens payment detail modals for completed and rejected payments
- payment invoice action opens the tax invoice receipt view
- payment details modal uses compact sizing
- rejected payment detail reason block stays compact
- reports page renders the complaints dashboard from the provided reference
- reward claim detail page supports read-only fulfillment detail states
- tasks page loads live task data and renders N/A when no rows are available
- users page renders the requested KPI cards and status summaries
- overview dashboard reproduces task tables and service breakdown panels
- public API base URL is documented through the environment template

## Task detail follow-up

Budget now formats as dollar currency with two decimals. Total Task Viewers stays visible, preserves zero, and shows N/A for unavailable counts. Targeted service tests: 9 passed. TypeScript passed. Full suite: 218 passed, the same 16 existing failures listed above.

## Login and reset footer

Added the responsive reference footer to Login and Reset Password. Copyright uses the current year. The footer remains below the form in normal flow.

Link destinations are not supplied in the repository. Set these public build-time environment variables to activate the links (until then, the labels render as non-interactive text):

- `NEXT_PUBLIC_PRIVACY_POLICY_URL`
- `NEXT_PUBLIC_TERMS_OF_SERVICE_URL`
- `NEXT_PUBLIC_HELP_CENTER_URL`
- `NEXT_PUBLIC_CONTACT_URL`

Verification: 21 login-page tests passed; TypeScript passed. Full suite: 218 passed and the same 16 existing failures listed above.

## User Details Task History

Replaced both mock task-history tables with a live panel scoped to the route's user ID. Task Poster shows posted tasks; Task Doer shows assigned tasks. Both roles support search, status/date filters, Reset, pagination, task-detail links, loading/error/empty states, and Retry. Requests are aborted on unmount, and user changes reset the panel.

The service scans the task listing and matches exact participant IDs. Sparse listings are resolved through task detail requests in batches of four. It does not use the signed-in administrator's my_tasks endpoints. Reward points and milestones are shown only when provided, otherwise N/A.

Coverage is limited to tasks exposed by the configured API and the administrator's permissions. Scanning all pages and resolving sparse task details can be slow for large task collections; a backend per-user history endpoint would avoid this work. No authenticated live-backend/browser check was performed.

Validation: production build (including TypeScript) passed; ESLint passed for the new service, types, tests and panel. Full suite: 219 passed, the same 16 existing failures listed above. Four service regression tests cover exact participant IDs, both roles, pagination, detail fallback, errors, name/ID ambiguity, date aliases, and combined filters. Replaced obsolete mock-data assertions with service behavior coverage.
