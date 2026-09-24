# Task listing filter requests

The frontend submits filters to `GET https://api.vtasker.com.au/api/tasks`.
Search and Filter both apply the current selections and reset to page 1.
Pagination retains applied filters; edits remain unapplied until submission.

| Control | Query parameter | Value |
| --- | --- | --- |
| Search | `search` | Trimmed task title/customer/provider search text |
| Suburbs | `suburb` | Suburb name, e.g. `Alexandria` |
| States | `state` | State code from location API, e.g. `NSW` (name if code absent) |
| Status | `status` | `pending`, `active`, `completed`, `cancelled`, `dispute`, `deleted` |
| With offers | `has_offers` | `true` |
| Without offers | `has_offers` | `false` |
| Date Created | `date_created_after`, `date_created_before` | Inclusive `YYYY-MM-DD` bounds |
| Pagination | `page`, `page_size` | Page 1 is omitted; page size is 10 |

All/All Time choices omit the corresponding parameters. Today uses the
browser's local date for both bounds. Last 7/30 Days includes today and the
previous 6/29 calendar dates. Custom Range requires valid ordered dates.
State and suburb choices are loaded from the location APIs.

Example: search cleaning in Alexandria, NSW, active tasks with offers,
created September 1–24, 2026, page 2:

```text
https://api.vtasker.com.au/api/tasks?page=2&page_size=10&search=cleaning&status=active&state=NSW&suburb=Alexandria&has_offers=true&date_created_after=2026-09-01&date_created_before=2026-09-24
```

## Backend contract assumptions

These are frontend request mappings, not verified backend capabilities.
The checked-in Swagger documents only search, ordering, and pagination for
the task list. Existing client code already sends state, suburb, status,
and date parameters; this change adds `has_offers`.

The backend must support the listed status aliases (including the business
meaning of Pending/Active/Dispute/Deleted), boolean offers filtering, state
codes, suburb names, and inclusive date bounds. Swagger currently lists raw
task statuses such as `DRAFT`, `OPEN`, and `IN_PROGRESS`, which differ from
these UI aliases. Backend filtering must happen before pagination and return
filtered `count`, `next`, and `previous` metadata. The frontend does not filter
only the current page or change API responses.
