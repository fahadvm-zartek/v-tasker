# Admin UI Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a shared dashboard design system and migrate the admin panel toward it without changing functionality.

**Architecture:** Global tokens in `app/globals.css` define the visual language. React primitives in `app/components/dashboard-ui.tsx` expose reusable page, card, table, button, form, badge, modal, and pagination surfaces. Pages migrate incrementally from one-off Tailwind values to those primitives.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, lucide-react, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-09-admin-ui-consistency-design.md`

## Global Constraints

- Primary brand color: Navy Blue `#1B3061`.
- Secondary/accent color: Yellow/orange `#E68A2E`.
- Preserve all business logic, API integration, routing, data, functionality, and existing features.
- Use the Users page/sidebar styling as the baseline reference.
- Reuse existing shared components/styles instead of one-off page overrides.

---

### Task 1: Shared Design Tokens And Dashboard Primitives

**Files:**
- Modify: `app/globals.css`
- Modify: `app/components/dashboard-ui.tsx`
- Modify: `app/components/index.ts`
- Test: `app/components/design-system.test.mjs`

**Interfaces:**
- Produces: `DashboardPageHeader`, `DashboardTableShell`, `DashboardPagination`, `DashboardIconButton`, and `dashboardButtonClass`.
- Consumes: existing `cn`, `DashboardPageShell`, `DashboardPanel`, `DashboardMetricCard`, `DashboardSearchField`, `DashboardSelectButton`, `DashboardPrimaryButton`, `DashboardSecondaryButton`, `dashboardStatusBadgeClass`.

- [ ] **Step 1: Write failing tests**

```js
assert.match(uiSource, /DashboardPageHeader/);
assert.match(uiSource, /DashboardTableShell/);
assert.match(uiSource, /DashboardPagination/);
assert.match(uiSource, /DashboardIconButton/);
assert.match(uiSource, /dashboardButtonClass/);
assert.match(globalsSource, /--space-page-x: 32px/);
assert.match(globalsSource, /\.ui-control/);
```

- [ ] **Step 2: Run test to verify failure**

Run: `node --test app/components/design-system.test.mjs`

- [ ] **Step 3: Implement shared tokens and primitives**

Add the tokens and primitives above, using the existing `Dashboard*` naming style and keeping class overrides available through `className`.

- [ ] **Step 4: Run test to verify pass**

Run: `node --test app/components/design-system.test.mjs`

### Task 2: Users Page Baseline Migration

**Files:**
- Modify: `app/users/page.tsx`
- Test: `app/users/page.test.mjs`

**Interfaces:**
- Consumes: `DashboardPageShell`, `DashboardMetricCard`, `DashboardPanel`, `DashboardPagination`, `dashboardButtonClass`, `cn`.
- Produces: Users page rendered with shared shell, cards, table panel, action button, and pagination.

- [ ] **Step 1: Write failing tests**

```js
assert.match(source, /DashboardPageShell/);
assert.match(source, /DashboardMetricCard/);
assert.match(source, /DashboardPanel/);
assert.match(source, /DashboardPagination/);
assert.doesNotMatch(source, /<Sidebar\s*\/>/);
assert.doesNotMatch(source, /<Header\s*\/>/);
```

- [ ] **Step 2: Run test to verify failure**

Run: `node --test app/users/page.test.mjs`

- [ ] **Step 3: Migrate Users page**

Replace the local shell with `DashboardPageShell`, metric card markup with `DashboardMetricCard`, the table wrapper with `DashboardPanel`, and the pagination markup with `DashboardPagination`.

- [ ] **Step 4: Run test to verify pass**

Run: `node --test app/users/page.test.mjs`

### Task 3: Continue Page Batches

**Files:**
- Modify: `app/tasks/page.tsx`
- Modify: `app/payment/page.tsx`
- Modify: `app/reports/page.tsx`
- Modify: `app/disputes/page.tsx`
- Modify: `app/cancellations/page.tsx`
- Modify: `app/rewards-platform/page.tsx`

**Interfaces:**
- Consumes: shared primitives from Task 1.
- Produces: list pages using consistent page header, metric cards, tables, filters, buttons, badges, and pagination.

- [ ] **Step 1: Add page-specific tests for shared primitives**
- [ ] **Step 2: Run each page test red**
- [ ] **Step 3: Migrate pages one at a time**
- [ ] **Step 4: Run focused tests after each page**
- [ ] **Step 5: Run `npm run lint` and `npm run build`**
