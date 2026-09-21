# V-Tasker Admin API

**Version:** 1.0.0
**Base OpenAPI version:** 3.0.3

API documentation for the V-Tasker admin panel. Used by platform administrators for user management, document verification, dispute resolution, and platform oversight.

## Authentication

Most endpoints require a **Bearer JWT token**, obtained from `POST /api/auth/login/`.

```
Authorization: Bearer <access_token>
```

Endpoints marked **Public** in the tables below can be called without authentication (they use `security: [{jwtAuth: []}, {}]` — auth optional).

Security scheme:

| Name | Type | Scheme | Bearer Format |
|---|---|---|---|
| `jwtAuth` | http | bearer | JWT |

---

## Table of Contents

1. [Admin](#admin)
2. [Auth](#auth)
3. [Badges](#badges)
4. [Cancellation Fees](#cancellation-fees)
5. [Categories & Subcategories](#categories--subcategories)
6. [Category Keywords](#category-keywords)
7. [Chat Rooms](#chat-rooms)
8. [Checklists (Components, Definitions, Options, Sections)](#checklists)
9. [Complaints](#complaints)
10. [Locations (Countries, States, Suburbs)](#locations)
11. [Disputes](#disputes)
12. [Documents](#documents)
13. [Escrow Payments](#escrow-payments)
14. [Invoices](#invoices)
15. [Milestone Tiers](#milestone-tiers)
16. [Moderation Logs](#moderation-logs)
17. [Notifications & Preferences](#notifications--preferences)
18. [Offers](#offers)
19. [Platform Config](#platform-config)
20. [Profiles](#profiles)
21. [Restricted Keywords](#restricted-keywords)
22. [Reviews](#reviews)
23. [Reward Claims & Configs](#reward-claims--configs)
24. [Tasks](#tasks)
25. [Transactions](#transactions)
26. [Users](#users)
27. [Wallets](#wallets)
28. [Withdrawals](#withdrawals)
29. [Appendix: Key Enums](#appendix-key-enums)

---

## Admin

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/dashboard/` | Aggregate KPIs for the admin dashboard (users, tasks, offers, payments, disputes, complaints, top categories/suburbs/doers/posters, recent disputes/payments). | JWT |
| GET | `/api/admin/reports/` | Date-range filtered stats for admin reports. Query: `from`, `to` (YYYY-MM-DD). | JWT |

**Response schema:** `AdminDashboard` / `AdminReports` — objects with sub-objects for `users`, `tasks`, `offers`, `payments`, `disputes` (and `complaints`, `top_*`, `recent_*` for the dashboard).

---

## Auth

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login/` | Validates credentials, returns JWT access/refresh tokens + user object. Body: `Login` (`username` or `email`, `password`). Returns `JWT`. | Public |
| POST | `/api/auth/logout/` | Deletes the refresh token, logs the user out. Body: `Logout` (`refresh`). | Public |
| POST | `/api/auth/password/change/` | Changes password for the authenticated user. Body: `PasswordChange` (`new_password1`, `new_password2`). | JWT |
| POST | `/api/auth/password/reset/` | Sends a password reset email. Body: `PasswordReset` (`email`). | Public |
| POST | `/api/auth/password/reset/confirm/` | Confirms reset via emailed token, sets new password. Body: `PasswordResetConfirm` (`new_password1`, `new_password2`, `uid`, `token`). | Public |
| POST | `/api/auth/registration/` | Registers a new user. Body: `CustomRegister` (`email`, `password1`, `password2`, `first_name`, `last_name`, `user_type_name`). Returns `JWT`. | Public |
| POST | `/api/auth/registration/resend-email/` | Resends verification email. Body: `ResendEmailVerification` (`email`). | Public |
| POST | `/api/auth/registration/verify-email/` | Verifies email via key. Body: `VerifyEmail` (`key`). | Public |
| POST | `/api/auth/token/refresh/` | Exchanges a refresh token for a new access token. Body: `TokenRefresh`. | Public |
| POST | `/api/auth/token/verify/` | Validates a JWT token. Body: `TokenVerify` (`token`). | Public |
| GET | `/api/auth/user/` | Returns the current user (`UserDetail`). | JWT |
| PUT | `/api/auth/user/` | Full update of current user profile fields (`username`, `first_name`, `last_name`). | JWT |
| PATCH | `/api/auth/user/` | Partial update of current user profile fields. | JWT |

---

## Badges

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/badges/` | List badges. Query: `ordering`, `page`, `page_size`, `search`. Returns `PaginatedBadgeList`. | JWT |
| GET | `/api/badges/{id}/` | Retrieve a single badge (`name`, `description`, `icon`, `criteria`, `is_active`, `created_at`). | JWT |

---

## Cancellation Fees

Read-only admin listing.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/cancellation-fees/` | List cancellation fees. Query: `created_after`, `created_before`, `is_paid`, `ordering`, `page`, `page_size`, `search`, `task`, `user`. Returns `PaginatedCancellationFeeList`. | JWT |
| GET | `/api/cancellation-fees/{id}/` | Retrieve a single cancellation fee (`task`, `task_title`, `user`, `user_email`, `amount`, `reason`, `is_paid`, `created_at`). | JWT |

---

## Categories & Subcategories

Public listing; admin can create/update/delete.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/categories/` | List service categories. Query: `ordering`, `search`. Returns array of `ServiceCategory`. | Public |
| POST | `/api/categories/` | Create a category. Body: `ServiceCategoryCreate`. | JWT |
| GET | `/api/categories/{id}/` | Retrieve a category. | Public |
| PUT | `/api/categories/{id}/` | Full update. Body: `ServiceCategoryCreate`. | JWT |
| PATCH | `/api/categories/{id}/` | Partial update. Body: `PatchedServiceCategoryCreate`. | JWT |
| DELETE | `/api/categories/{id}/` | Delete a category. | JWT |
| GET | `/api/categories/{id}/checklist/` | Returns the active published checklist for this category (`ServiceCategory`). | Public |
| GET | `/api/subcategories/` | List service subcategories. Query: `ordering`, `search`. Returns array of `ServiceSubcategory`. | Public |
| POST | `/api/subcategories/` | Create a subcategory. Body: `ServiceSubcategory`. | JWT |
| GET | `/api/subcategories/{id}/` | Retrieve a subcategory. | Public |
| PUT | `/api/subcategories/{id}/` | Full update. | JWT |
| PATCH | `/api/subcategories/{id}/` | Partial update. Body: `PatchedServiceSubcategory`. | JWT |
| DELETE | `/api/subcategories/{id}/` | Delete a subcategory. | JWT |

**`ServiceCategory` fields:** `id`, `name`, `slug`, `category_type` (`IN_PERSON`/`PROFESSIONAL`/`ONLINE`), `description`, `icon`, `is_active`, `order`, `subcategories[]`, `keywords[]`.
**`ServiceSubcategory` fields:** `id`, `category`, `name`, `slug`, `description`, `is_active`, `order`.

---

## Category Keywords

Admin CRUD, used to auto-match tasks to categories.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/category-keywords/` | List keywords. Query: `category`, `is_active`, `ordering`, `page`, `page_size`, `search`. Returns `PaginatedCategoryKeywordList`. | JWT |
| POST | `/api/category-keywords/` | Create a keyword. Body: `CategoryKeyword` (`category`, `keyword`, `is_active`). | JWT |
| GET | `/api/category-keywords/{id}/` | Retrieve a keyword. | JWT |
| PUT | `/api/category-keywords/{id}/` | Full update. | JWT |
| PATCH | `/api/category-keywords/{id}/` | Partial update. Body: `PatchedCategoryKeyword`. | JWT |
| DELETE | `/api/category-keywords/{id}/` | Delete a keyword. | JWT |

---

## Chat Rooms

Chat rooms are backed by an external "Wibe Chat" service.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/chat-rooms/` | List chat rooms. Query: `is_active`, `ordering`, `page`, `page_size`, `search`, `task`. Returns `PaginatedChatRoomList`. | JWT |
| GET | `/api/chat-rooms/{id}/` | Retrieve a chat room (`task_id`, `task_title`, `poster_id/name`, `doer_id/name`, `wibe_channel_id`, `is_active`, `created_at`). | JWT |
| GET | `/api/chat-rooms/{id}/messages/` | Return chat history from Wibe Chat for this room. | JWT |

---

## Checklists

Admin-managed, versioned checklist definitions used per task category. Hierarchy: **Definition → Sections → Components → Options**.

### Checklist Definitions

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/checklist-definitions/` | List definitions. Query: `category`, `ordering`, `page`, `page_size`, `search`, `status` (`draft`/`published`/`archived`). Returns `PaginatedChecklistDefinitionListList`. | JWT |
| POST | `/api/checklist-definitions/` | Create a definition. Body: `ChecklistDefinitionCreate` (`category`, `slug`, `screen_title`, `screen_subtitle`, `screen_navigation_title`, `screen_hero_icon_key`). | JWT |
| GET | `/api/checklist-definitions/{id}/` | Retrieve full detail incl. `sections[]`. Returns `ChecklistDefinitionDetail`. | JWT |
| PUT | `/api/checklist-definitions/{id}/` | Full update. | JWT |
| PATCH | `/api/checklist-definitions/{id}/` | Partial update. Body: `PatchedChecklistDefinitionDetail`. | JWT |
| DELETE | `/api/checklist-definitions/{id}/` | Delete a definition. | JWT |
| POST | `/api/checklist-definitions/{id}/archive/` | Archive a published checklist. | JWT |
| POST | `/api/checklist-definitions/{id}/new-version/` | Clone a published checklist as a new draft version. | JWT |
| POST | `/api/checklist-definitions/{id}/publish/` | Validate and publish a draft checklist. | JWT |

### Checklist Sections

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/checklist-sections/` | List sections. Query: `ordering`, `page`, `page_size`, `search`. | JWT |
| POST | `/api/checklist-sections/` | Create a section. Body: `ChecklistSection` (`definition`, `slug`, `order`, `title`, `eyebrow`, `helper_text`, `icon_key`, `presentation`). | JWT |
| GET/PUT/PATCH/DELETE | `/api/checklist-sections/{id}/` | Retrieve/update/delete a section, incl. `components[]`. | JWT |

### Checklist Components

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/checklist-components/` | List components. Query: `ordering`, `page`, `page_size`, `search`. | JWT |
| POST | `/api/checklist-components/` | Create a component. Body: `ChecklistComponent` (`section`, `slug`, `component_number` C01–C11, `component_type`, `order`, `presentation`, `label`, `title`, `subtitle`, `helper_text`, `placeholder`, `trailing_text`, `icon_key`, `required`, `default_value`, `constraints`, `visibility`). | JWT |
| GET/PUT/PATCH/DELETE | `/api/checklist-components/{id}/` | Retrieve/update/delete a component, incl. `options[]`. | JWT |

### Checklist Options

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/checklist-options/` | List component options. Query: `ordering`, `page`, `page_size`, `search`. | JWT |
| POST | `/api/checklist-options/` | Create an option. Body: `ComponentOption` (`component`, `slug`, `order`, `label`, `subtitle`, `trailing_text`, `icon_key`, `layout_span` `standard`/`full`). | JWT |
| GET/PUT/PATCH/DELETE | `/api/checklist-options/{id}/` | Retrieve/update/delete an option. | JWT |

**Component types (`ComponentTypeEnum`):** `content_block`, `single_select`, `multi_select`, `counter`, `short_text`, `long_text`, `number_input`, `boolean_toggle`, `location_input`, `repeatable_text_list`, `date_input`.

---

## Complaints

Users file complaints against other users; admins resolve them.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/complaints/` | List complaints (own for users, all for admin). Query: `ordering`, `page`, `page_size`, `search`. Returns `PaginatedComplaintListList`. | JWT |
| POST | `/api/complaints/` | Create a complaint. Body: `ComplaintCreate` (`reported_user`, `task?`, `category`, `description`). | JWT |
| GET | `/api/complaints/{id}/` | Retrieve full detail. Returns `ComplaintDetail`. | JWT |
| PUT | `/api/complaints/{id}/` | Full update. | JWT |
| PATCH | `/api/complaints/{id}/` | Partial update. Body: `PatchedComplaintDetail`. | JWT |
| DELETE | `/api/complaints/{id}/` | Delete a complaint. | JWT |
| POST | `/api/complaints/{id}/resolve/` | Resolve a complaint (admin only). Body: `ComplaintResolve` (`status` `RESOLVED`/`DISMISSED`, `resolution`, `admin_notes`). | JWT |

**`CategoryEnum`** (complaint category): `QUALITY`, `BEHAVIOUR`, `SAFETY`, `FRAUD`, `HARASSMENT`, `NO_SHOW`, `OTHER`.
**Complaint status (`Status046Enum`):** `OPEN`, `UNDER_REVIEW`, `RESOLVED`, `DISMISSED`.

---

## Locations

Countries, States/Regions, and Suburbs. Public listing; admin manages.

### Countries

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/countries/` | List countries. Query: `ordering`, `page`, `page_size`, `search`. Returns `PaginatedCountryList`. | Public |
| POST | `/api/countries/` | Create country (Admin). Body: `Country` (`name`, `code`, `is_active`). | JWT |
| GET | `/api/countries/{id}/` | Get country detail. | Public |
| PUT | `/api/countries/{id}/` | Update country (Admin). | JWT |
| PATCH | `/api/countries/{id}/` | Partial update (Admin). Body: `PatchedCountry`. | JWT |
| DELETE | `/api/countries/{id}/` | Delete country (Admin). | JWT |

### States / Regions

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/states/` | List states. Query: `country`, `country_code`, `ordering`, `page`, `page_size`, `search`. Returns `PaginatedStateList`. | Public |
| POST | `/api/states/` | Create state (Admin). Body: `State` (`name`, `abbreviation`, `country`, `is_active`). | JWT |
| GET | `/api/states/{id}/` | Get state detail. | Public |
| PUT | `/api/states/{id}/` | Update state (Admin). | JWT |
| PATCH | `/api/states/{id}/` | Partial update (Admin). Body: `PatchedState`. | JWT |
| DELETE | `/api/states/{id}/` | Delete state (Admin). | JWT |

### Suburbs

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/suburbs/` | List suburbs. Query: `country`, `name`, `ordering`, `page`, `page_size`, `postcode`, `search`, `state`, `state_abbreviation`. Returns `PaginatedSuburbListList`. | Public |
| POST | `/api/suburbs/` | Create suburb (Admin). Body: `SuburbCreate` (`name`, `postcode`, `state`, `latitude`, `longitude`, `is_active`). | JWT |
| GET | `/api/suburbs/{id}/` | Get suburb detail. Returns `SuburbDetail` (nested `state`). | Public |
| PUT | `/api/suburbs/{id}/` | Update suburb (Admin). | JWT |
| PATCH | `/api/suburbs/{id}/` | Partial update (Admin). Body: `PatchedSuburbCreate`. | JWT |
| DELETE | `/api/suburbs/{id}/` | Delete suburb (Admin). | JWT |

---

## Disputes

Raised on tasks between poster and doer; admins resolve.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/disputes/` | List disputes. Query: `against`, `created_after`, `created_before`, `ordering`, `page`, `page_size`, `raised_by`, `search`, `status`, `task`. Returns `PaginatedDisputeListList`. | JWT |
| POST | `/api/disputes/` | Create a dispute. Body: `DisputeCreate` (`task`, `reason`). | JWT |
| GET | `/api/disputes/{id}/` | Retrieve full detail incl. `evidence[]`, `activities[]`. Returns `DisputeDetail`. | JWT |
| PUT | `/api/disputes/{id}/` | Full update. | JWT |
| PATCH | `/api/disputes/{id}/` | Partial update. Body: `PatchedDisputeDetail`. | JWT |
| DELETE | `/api/disputes/{id}/` | Delete a dispute. | JWT |
| POST | `/api/disputes/{id}/add-comment/` | Add a comment activity to a dispute. | JWT |
| POST | `/api/disputes/{id}/add-evidence/` | Add evidence (file + description) to a dispute. | JWT |
| POST | `/api/disputes/{id}/resolve/` | Resolve a dispute (admin only). | JWT |

**Dispute status (`Status8cdEnum`):** `OPEN`, `UNDER_REVIEW`, `RESOLVED_POSTER`, `RESOLVED_DOER`, `RESOLVED_SPLIT`, `CLOSED`.
**`ActivityTypeEnum`:** `COMMENT`, `STATUS_CHANGE`, `EVIDENCE_ADDED`.

---

## Documents

User-uploaded verification documents (ID, license, ABN, etc.), reviewed by admins.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/documents/` | List documents. Query: `document_type`, `ordering`, `page`, `page_size`, `search`, `status`. Returns `PaginatedDocumentListList`. | JWT |
| POST | `/api/documents/` | Upload a document. Body: `DocumentDetail` (`document_type`, `file`). | JWT |
| GET | `/api/documents/{id}/` | Retrieve document detail. | JWT |
| PUT | `/api/documents/{id}/` | Full update. | JWT |
| PATCH | `/api/documents/{id}/` | Partial update. Body: `PatchedDocumentDetail`. | JWT |
| DELETE | `/api/documents/{id}/` | Delete a document. | JWT |
| POST | `/api/documents/{id}/review/` | Admin review: approve or reject. Body: `DocumentReview` (`status` `APPROVED`/`REJECTED`, `rejection_reason`). | JWT |

**`DocumentTypeEnum`:** `ID`, `LICENSE`, `ABN`, `INSURANCE`, `QUALIFICATION`, `POLICE_CHECK`, `WWCC`, `STUDENT_ID`.
**Document status (`StatusDcaEnum`):** `PENDING`, `APPROVED`, `REJECTED`.

---

## Escrow Payments

Stripe-backed escrow held per task until release.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/escrow-payments/` | List escrow payments (own or all for admin). Query: `created_after`, `created_before`, `ordering`, `page`, `page_size`, `payer`, `search`, `status`, `task`. Returns `PaginatedEscrowPaymentList`. | JWT |
| GET | `/api/escrow-payments/{id}/` | Retrieve one escrow payment. | JWT |
| POST | `/api/escrow-payments/{id}/release/` | Poster manually releases escrowed funds to the doer. | JWT |
| POST | `/api/escrow-payments/create-payment/` | Create a Stripe PaymentIntent for a task escrow payment. | JWT |

**Escrow status (`EscrowPaymentStatusEnum`):** `PENDING`, `HELD`, `RELEASED`, `REFUNDED`, `DISPUTED`.

---

## Invoices

Read-only, generated per completed task.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/invoices/` | List invoices (own or all for admin). Query: `ordering`, `page`, `page_size`, `search`. Returns `PaginatedInvoiceList`. | JWT |
| GET | `/api/invoices/{id}/` | Retrieve one invoice (`task`, `amount`, `commission`, `net_amount`, `invoice_number`, `pdf`, `created_at`). | JWT |

---

## Milestone Tiers

Gamification tiers (Bronze/Silver/Gold/Platinum) based on user points.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/milestone-tiers/` | List tiers. Query: `ordering`, `search`. Returns array of `MilestoneTier`. | JWT |
| POST | `/api/milestone-tiers/` | Create a tier. Body: `MilestoneTier` (`name`, `min_points`, `max_points`, `icon`, `color`, `benefits`, `bonus_percentage`, `is_active`, `order`). | JWT |
| GET/PUT/PATCH/DELETE | `/api/milestone-tiers/{id}/` | Retrieve/update/delete a tier. | JWT |

---

## Moderation Logs

Chat moderation audit trail (keyword matches, actions taken).

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/moderation-logs/` | List logs. Query: `ordering`, `page`, `page_size`, `search`. Returns `PaginatedModerationLogList`. | JWT |
| POST | `/api/moderation-logs/` | Create a log entry. Body: `ModerationLogCreate` (`chat_room`, `user`, `message_content`, `keyword_matched?`, `action_taken`, `notes`). | JWT |
| GET/PUT/PATCH/DELETE | `/api/moderation-logs/{id}/` | Retrieve/update/delete a log entry. | JWT |

**`ActionTakenEnum`:** `FLAGGED`, `DELETED`, `WARNING_SENT`, `USER_SUSPENDED`.

---

## Notifications & Preferences

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/notifications/` | List own notifications. Query: `is_read`, `notification_type`, `ordering`, `page`, `page_size`, `search`. Returns `PaginatedNotificationList`. | JWT |
| GET | `/api/notifications/{id}/` | Retrieve a notification. | JWT |
| PATCH | `/api/notifications/{id}/` | Partial update. Body: `PatchedNotification`. | JWT |
| PATCH | `/api/notifications/{id}/mark-read/` | Mark a single notification as read. | JWT |
| PATCH | `/api/notifications/mark-all-read/` | Mark all unread notifications as read. | JWT |
| GET | `/api/notifications/unread-count/` | Return the count of unread notifications. | JWT |
| GET | `/api/notification-preferences/` | Redirect list to retrieve the single preference object. Returns `PaginatedNotificationPreferenceList`. | JWT |
| GET | `/api/notification-preferences/{id}/` | Get own notification preferences. | JWT |
| PUT | `/api/notification-preferences/{id}/` | Update own notification preferences. | JWT |
| PATCH | `/api/notification-preferences/{id}/` | Partial update. Body: `PatchedNotificationPreference`. | JWT |

**`NotificationTypeEnum`:** `TASK_UPDATE`, `OFFER_RECEIVED`, `OFFER_ACCEPTED`, `PAYMENT`, `CHAT`, `DISPUTE`, `REVIEW`, `REWARD`, `SYSTEM`.
**`NotificationPreference` fields:** `push_enabled`, `email_enabled`, `task_updates`, `offer_updates`, `payment_updates`, `chat_updates`, `review_updates`, `marketing`.

---

## Offers

Doers make offers on open tasks; posters accept/reject.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/offers/` | List offers. Query: `doer`, `ordering`, `page`, `page_size`, `search`, `status`, `task`. Returns `PaginatedOfferListList`. | JWT |
| POST | `/api/offers/` | Create an offer (TASK_DOER). Body: `OfferCreate` (`task`, `price`, `description`, `availability?`). | JWT |
| GET | `/api/offers/{id}/` | Retrieve full offer detail incl. `messages[]`. Returns `OfferDetail`. | JWT |
| PUT | `/api/offers/{id}/` | Full update. | JWT |
| PATCH | `/api/offers/{id}/` | Partial update. Body: `PatchedOfferDetail`. | JWT |
| DELETE | `/api/offers/{id}/` | Delete an offer. | JWT |
| POST | `/api/offers/{id}/accept/` | Task poster accepts this offer. | JWT |
| POST | `/api/offers/{id}/reject/` | Task poster rejects this offer. | JWT |
| POST | `/api/offers/{id}/withdraw/` | Doer withdraws their own offer. | JWT |
| GET | `/api/offers/{id}/messages/` | List messages on an offer. | JWT |
| POST | `/api/offers/{id}/messages/` | Send a message on an offer (poster or doer). Body: `OfferMessageCreate` (`message`). | JWT |

**Offer status (`Status852Enum`):** `PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`.

---

## Platform Config

Admin-managed key/value platform-wide settings.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/platform-config/` | List config entries. Query: `ordering`, `page`, `page_size`, `search`. Returns `PaginatedPlatformConfigList`. | JWT |
| POST | `/api/platform-config/` | Create a config entry. Body: `PlatformConfig` (`key`, `value`, `description`). | JWT |
| GET | `/api/platform-config/{key}/` | Retrieve a config entry by key. | JWT |
| PUT | `/api/platform-config/{key}/` | Full update. | JWT |
| PATCH | `/api/platform-config/{key}/` | Partial update. Body: `PatchedPlatformConfig`. | JWT |
| DELETE | `/api/platform-config/{key}/` | Delete a config entry. | JWT |

---

## Profiles

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/profiles/` | List user profiles. Query: `ordering`, `page`, `page_size`, `search`. Returns `PaginatedUserProfileList`. | JWT |
| POST | `/api/profiles/` | Create a profile. Body: `UserProfile`. | JWT |
| GET | `/api/profiles/{id}/` | Retrieve a profile. | JWT |
| PUT | `/api/profiles/{id}/` | Full update. | JWT |
| PATCH | `/api/profiles/{id}/` | Partial update. Body: `PatchedUserProfile`. | JWT |
| DELETE | `/api/profiles/{id}/` | Delete a profile. | JWT |

**`UserProfile` fields:** `avatar`, `bio`, `date_of_birth`, `abn`, `suburb`, `skills`, `average_rating`, `total_reviews`, `tasks_completed`, `tasks_posted`, `completion_rate`, `milestone_tier`, `total_points`, `is_verified`, `admin_notes`.

---

## Restricted Keywords

Chat moderation keyword blocklist.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/restricted-keywords/` | List keywords. Query: `is_active`, `ordering`, `search`, `severity`. Returns array of `RestrictedKeyword`. | JWT |
| POST | `/api/restricted-keywords/` | Create a keyword. Body: `RestrictedKeyword` (`keyword`, `severity`, `is_active`). | JWT |
| GET/PUT/PATCH/DELETE | `/api/restricted-keywords/{id}/` | Retrieve/update/delete a keyword. | JWT |

**`SeverityEnum`:** `LOW`, `MEDIUM`, `HIGH`.

---

## Reviews

Task participants review each other post-completion.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/reviews/` | Public listing of reviews. Query: `ordering`, `page`, `page_size`, `rating`, `reviewee`, `reviewer`, `search`, `task`. Returns `PaginatedReviewListList`. | Public |
| POST | `/api/reviews/` | Create a review for a completed task. Body: `ReviewCreate` (`task`, `reviewee`, `rating` 1–5, `comment`). | JWT |
| GET | `/api/reviews/{id}/` | Full review detail incl. comment. Returns `ReviewDetail`. | Public |

---

## Reward Claims & Configs

Doer milestone rewards, poster bonuses, referral rewards.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/reward-claims/` | List own reward claims (admin sees all). Query: `ordering`, `page`, `page_size`, `search`, `status`, `user`. Returns `PaginatedRewardClaimList`. | JWT |
| POST | `/api/reward-claims/` | Claim an unclaimed reward. Body: `RewardClaimCreate` (`doer_reward?`, `poster_reward?`). | JWT |
| GET | `/api/reward-claims/{id}/` | Full claim detail. Returns `RewardClaim`. | JWT |
| GET | `/api/reward-claims/my-doer-rewards/` | List all doer rewards for the authenticated user. | JWT |
| GET | `/api/reward-claims/my-poster-rewards/` | List all poster rewards for the authenticated user. | JWT |
| GET | `/api/reward-configs/` | List reward configurations. Query: `ordering`, `reward_type`, `search`. Returns array of `RewardConfig`. | JWT |
| POST | `/api/reward-configs/` | Create a config. Body: `RewardConfigCreate` (`name`, `description`, `reward_type`, `threshold`, `reward_amount`, `is_active`). | JWT |
| GET/PUT/PATCH/DELETE | `/api/reward-configs/{id}/` | Retrieve/update/delete a config. | JWT |

**`RewardTypeEnum`:** `DOER_MILESTONE`, `POSTER_BONUS`, `REFERRAL`.
**Reward claim status (`RewardClaimStatusEnum`):** `PENDING`, `CREDITED`, `EXPIRED`.
**`MilestoneTierEnum`:** `BRONZE`, `SILVER`, `GOLD`, `PLATINUM`.

---

## Tasks

Core task lifecycle. Public browsing; authenticated create/update.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks/` | Public task listing. Query: `ordering`, `page`, `page_size`, `search`. Returns `PaginatedTaskListList`. | Public |
| POST | `/api/tasks/` | Create a task (TASK_POSTER). Body: `TaskCreate` (`title`, `description`, `category`, `subcategory`, `priority`, `location_type`, `suburb`, `address`, `latitude`, `longitude`, `budget`, `due_date`, `images[]`, `checklist_items[]`, `checklist_answers`). | JWT |
| GET | `/api/tasks/{id}/` | Full task detail incl. `images[]`, `checklists[]`, `checklist_snapshot`, `questions[]`, `submissions[]`. Returns `TaskDetail`. | Public |
| PUT | `/api/tasks/{id}/` | Full update (owner/admin). | JWT |
| PATCH | `/api/tasks/{id}/` | Partial update. Body: `PatchedTaskDetail`. | JWT |
| DELETE | `/api/tasks/{id}/` | Delete a task (owner/admin). | JWT |
| POST | `/api/tasks/{id}/publish/` | Transition DRAFT → OPEN. | JWT |
| POST | `/api/tasks/{id}/cancel/` | Cancel a task (DRAFT/OPEN/ASSIGNED → CANCELLED). | JWT |
| POST | `/api/tasks/{id}/start/` | Doer starts work (ASSIGNED → IN_PROGRESS). | JWT |
| POST | `/api/tasks/{id}/submit/` | Doer submits proof of work (IN_PROGRESS → SUBMITTED). | JWT |
| POST | `/api/tasks/{id}/accept-submission/` | Poster accepts the submission (SUBMITTED → COMPLETED). | JWT |
| POST | `/api/tasks/{id}/reject-submission/` | Poster rejects the submission (SUBMITTED → IN_PROGRESS). | JWT |
| POST | `/api/tasks/{id}/complete/` | Admin override: complete a task (IN_PROGRESS → COMPLETED). | JWT |
| POST | `/api/tasks/{id}/increase-budget/` | Poster increases the task budget. | JWT |
| GET | `/api/tasks/{id}/questions/` | List questions on a task. | JWT |
| POST | `/api/tasks/{id}/questions/` | Ask a question on a task. | JWT |
| POST | `/api/tasks/{id}/questions/{question_pk}/reply/` | Reply to a question on a task. | JWT |
| GET | `/api/tasks/{id}/receipt/` | Task receipt/summary with payment details (completed tasks). | JWT |
| GET | `/api/tasks/my_tasks/` | Tasks posted by the current user. | JWT |
| GET | `/api/tasks/my_assigned_tasks/` | Tasks assigned to the current user as a doer. | JWT |

**Task status (`StatusCfbEnum`):** `DRAFT`, `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `SUBMITTED`, `COMPLETED`, `EXPIRED`, `CANCELLED`.
**`PriorityEnum`:** `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
**`LocationTypeEnum`:** `IN_PERSON`, `REMOTE`.

---

## Transactions

Read-only ledger of all financial transactions.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/transactions/` | List transactions (own, or all for admin). Query: `created_after`, `created_before`, `ordering`, `page`, `page_size`, `search`, `transaction_type`, `user`. Returns `PaginatedTransactionList`. | JWT |
| GET | `/api/transactions/{id}/` | Retrieve one transaction. | JWT |

**`transaction_type` enum:** `ESCROW_HOLD`, `ESCROW_RELEASE`, `COMMISSION`, `CANCELLATION_FEE`, `REFUND`, `WITHDRAWAL`, `REWARD`.

---

## Users

Admin user management.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/users/` | List/search all users (admin). Query: `date_joined_after`, `date_joined_before`, `is_active`, `is_email_verified`, `is_phone_verified`, `ordering`, `page`, `page_size`, `phone`, `search`, `user_type`. Returns `PaginatedUserListList`. | JWT |
| POST | `/api/users/` | Create a user. Body: `UserDetail`. | JWT |
| GET | `/api/users/{id}/` | Retrieve a user. | JWT |
| PUT | `/api/users/{id}/` | Full update. | JWT |
| PATCH | `/api/users/{id}/` | Partial update. Body: `PatchedUserDetail`. | JWT |
| DELETE | `/api/users/{id}/` | Delete a user. | JWT |
| POST | `/api/users/{id}/activate/` | Reactivate a user account. | JWT |
| POST | `/api/users/{id}/suspend/` | Suspend a user account. | JWT |
| POST | `/api/users/{id}/change-type/` | Admin changes a user's type (`ADMIN`/`TASK_POSTER`/`TASK_DOER`/`BOTH`). | JWT |
| GET | `/api/users/{id}/public-profile/` | Return limited public profile data for any user. | JWT |
| GET | `/api/users/me/` | Retrieve the authenticated user. | JWT |
| PATCH | `/api/users/me/` | Partial update of own account. Body: `PatchedUserDetail`. | JWT |
| POST | `/api/users/me/deactivate/` | Soft-delete own account (App Store / Play Store compliance). | JWT |

**`NameEnum` (user type):** `ADMIN`, `TASK_POSTER`, `TASK_DOER`, `BOTH`.
**Key `UserDetail` fields:** `id`, `member_id`, `email`, `phone`, `first_name`, `last_name`, `user_type`, `is_active`, `is_phone_verified`, `is_email_verified`, `is_profile_complete`, `date_joined`, `last_interaction_at`, `profile` (nested `UserProfileNested`).

---

## Wallets

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/wallets/me/` | Retrieve own wallet (`balance`, `recent_transactions[]`). | JWT |
| GET | `/api/wallets/all/` | Admin: list all wallets. | JWT |
| POST | `/api/wallets/setup-intent/` | Create a Stripe SetupIntent for saving a payment method. | JWT |

**Wallet transaction type:** `CREDIT`, `DEBIT`, `WITHDRAWAL`, `REWARD`.

---

## Withdrawals

Users request payouts from their wallet to a bank account; admin approves/rejects.

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/withdrawals/` | List own withdrawals (admin sees all). Query: `ordering`, `page`, `page_size`, `requested_after`, `requested_before`, `search`, `status`, `user`. Returns `PaginatedWithdrawalList`. | JWT |
| POST | `/api/withdrawals/` | Request a withdrawal. Body: `WithdrawalCreate` (`amount`, `bank_account`). | JWT |
| GET | `/api/withdrawals/{id}/` | Retrieve a withdrawal. | JWT |
| PUT | `/api/withdrawals/{id}/` | Full update. | JWT |
| PATCH | `/api/withdrawals/{id}/` | Partial update. Body: `PatchedWithdrawal`. | JWT |
| DELETE | `/api/withdrawals/{id}/` | Delete a withdrawal. | JWT |
| POST | `/api/withdrawals/{id}/approve/` | Admin approves a pending withdrawal. | JWT |
| POST | `/api/withdrawals/{id}/reject/` | Admin rejects a pending withdrawal. | JWT |

**Withdrawal status (`WithdrawalStatusEnum`):** `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`.

---

## Appendix: Key Enums

| Enum | Values |
|---|---|
| User type (`NameEnum`) | `ADMIN`, `TASK_POSTER`, `TASK_DOER`, `BOTH` |
| Task status (`StatusCfbEnum`) | `DRAFT`, `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `SUBMITTED`, `COMPLETED`, `EXPIRED`, `CANCELLED` |
| Task priority (`PriorityEnum`) | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| Location type (`LocationTypeEnum`) | `IN_PERSON`, `REMOTE` |
| Offer status (`Status852Enum`) | `PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN` |
| Dispute status (`Status8cdEnum`) | `OPEN`, `UNDER_REVIEW`, `RESOLVED_POSTER`, `RESOLVED_DOER`, `RESOLVED_SPLIT`, `CLOSED` |
| Complaint status (`Status046Enum`) | `OPEN`, `UNDER_REVIEW`, `RESOLVED`, `DISMISSED` |
| Complaint category (`CategoryEnum`) | `QUALITY`, `BEHAVIOUR`, `SAFETY`, `FRAUD`, `HARASSMENT`, `NO_SHOW`, `OTHER` |
| Document type (`DocumentTypeEnum`) | `ID`, `LICENSE`, `ABN`, `INSURANCE`, `QUALIFICATION`, `POLICE_CHECK`, `WWCC`, `STUDENT_ID` |
| Document status (`StatusDcaEnum`) | `PENDING`, `APPROVED`, `REJECTED` |
| Escrow status (`EscrowPaymentStatusEnum`) | `PENDING`, `HELD`, `RELEASED`, `REFUNDED`, `DISPUTED` |
| Withdrawal status (`WithdrawalStatusEnum`) | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| Transaction type | `ESCROW_HOLD`, `ESCROW_RELEASE`, `COMMISSION`, `CANCELLATION_FEE`, `REFUND`, `WITHDRAWAL`, `REWARD` |
| Notification type (`NotificationTypeEnum`) | `TASK_UPDATE`, `OFFER_RECEIVED`, `OFFER_ACCEPTED`, `PAYMENT`, `CHAT`, `DISPUTE`, `REVIEW`, `REWARD`, `SYSTEM` |
| Reward type (`RewardTypeEnum`) | `DOER_MILESTONE`, `POSTER_BONUS`, `REFERRAL` |
| Reward claim status | `PENDING`, `CREDITED`, `EXPIRED` |
| Milestone tier (`MilestoneTierEnum`) | `BRONZE`, `SILVER`, `GOLD`, `PLATINUM` |
| Restricted keyword severity (`SeverityEnum`) | `LOW`, `MEDIUM`, `HIGH` |
| Moderation action (`ActionTakenEnum`) | `FLAGGED`, `DELETED`, `WARNING_SENT`, `USER_SUSPENDED` |
| Dispute activity type (`ActivityTypeEnum`) | `COMMENT`, `STATUS_CHANGE`, `EVIDENCE_ADDED` |
| Checklist status (`StatusDaeEnum`) | `draft`, `published`, `archived` |
| Checklist component type (`ComponentTypeEnum`) | `content_block`, `single_select`, `multi_select`, `counter`, `short_text`, `long_text`, `number_input`, `boolean_toggle`, `location_input`, `repeatable_text_list`, `date_input` |
| Category type (`CategoryTypeEnum`) | `IN_PERSON`, `PROFESSIONAL`, `ONLINE` |

---

*Generated from the V-Tasker Admin API OpenAPI 3.0.3 specification. All endpoints return JSON; most list endpoints support pagination (`page`, `page_size`) and many support `ordering` and `search` query parameters.*