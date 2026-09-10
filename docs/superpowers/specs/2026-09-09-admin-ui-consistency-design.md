# Admin UI Consistency Design

**Goal:** Standardize the admin panel UI around shared dashboard tokens and reusable components while preserving current data, routing, and interactions.

**Baseline:** Use the Users page structure and the dark navy sidebar as the product visual language. Primary brand is navy `#1B3061`; accent is yellow/orange `#E68A2E`; semantic states remain green, orange, red, blue, and gray.

**Approach:** Extend `app/globals.css` and `app/components/dashboard-ui.tsx` first, then migrate pages to consume the shared primitives. Avoid page-specific redesigns and avoid changing business logic.

**Shared Primitives:**
- `DashboardPageShell` owns the sidebar/header/content layout.
- `DashboardPageHeader` owns page titles, descriptions, and right actions.
- `DashboardPanel`, `DashboardMetricCard`, and table classes own cards and tables.
- Shared button, input/select, badge, pagination, and modal classes define repeated interaction styles.

**Migration Order:**
1. Strengthen tokens and shared dashboard primitives.
2. Migrate Users page because it is the requested baseline.
3. Migrate list-heavy pages: Tasks, Payment, Reports, Disputes, Cancellations, Rewards.
4. Migrate detail/modal-heavy pages: task details, offer details, dispute details, reports detail, rewards claims.
5. Migrate configuration and moderation pages.

**Constraints:**
- Preserve all routes, data, tabs, modals, filters, tables, and buttons.
- Do not remove semantic status colors.
- Use shared components/classes before adding new local styling.
- Verify with tests, lint, and `next build`.
