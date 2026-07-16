/**
 * Helpers for reading Featurebase REST responses across API versions.
 *
 * The app pins the Nova API version (see utils/apiHelpers.ts). Under Nova,
 * collections come back as `{ object: "list", data: [...] }` and a single
 * resource is returned as the object directly. The legacy (clover) API returned
 * `{ success, results }` for collections and sometimes wrapped a single resource
 * in `results` (occasionally as a one-element array).
 *
 * Blocks should route every list/get response through these helpers instead of
 * reading `response.results` or emitting the raw response, so a version/envelope
 * rename is handled in one place rather than silently producing empty output.
 */

/**
 * Extracts the array of items from a list response, tolerating both the Nova
 * (`data`) and legacy (`results`) envelopes. Always returns an array.
 */
export function unwrapList(response: any): any[] {
  // Most Nova collections are `{ object: "list", data: [...] }`, but a few
  // endpoints (e.g. GET /v2/boards) return a bare array.
  if (Array.isArray(response)) {
    return response;
  }
  const items = response?.data ?? response?.results;
  return Array.isArray(items) ? items : [];
}

/**
 * Extracts a single resource from a get-by-id response. Nova returns the object
 * directly; the legacy API sometimes wrapped it in `results` (occasionally as a
 * one-element array). Returns the response unchanged when no wrapper is present.
 */
export function unwrapItem(response: any): any {
  const wrapped = response?.results;
  if (Array.isArray(wrapped)) {
    return wrapped[0];
  }
  return wrapped ?? response;
}

interface Pagination {
  page?: number;
  limit?: number;
  totalPages?: number;
  totalResults?: number;
}

/**
 * Extracts pagination metadata into the `{ page, limit, totalPages,
 * totalResults }` shape the output schemas declare. Reads from a nested Nova
 * `pagination` object when present, otherwise from the flat legacy fields.
 *
 * Only fields that are actually present as numbers are included; if none are
 * found this returns `undefined` so callers can omit the `pagination` key
 * entirely rather than emit fabricated defaults.
 *
 * NOTE: the exact Nova pagination field names are unverified. If Nova uses
 * cursor-based paging none of these match and `undefined` is returned; the item
 * array (unwrapList) is the part that is confirmed correct.
 */
export function normalizePagination(response: any): Pagination | undefined {
  const p = response?.pagination ?? response ?? {};
  const pagination: Pagination = {};
  if (typeof p.page === "number") pagination.page = p.page;
  if (typeof p.limit === "number") pagination.limit = p.limit;
  if (typeof p.totalPages === "number") pagination.totalPages = p.totalPages;
  const totalResults = p.totalResults ?? p.total;
  if (typeof totalResults === "number") pagination.totalResults = totalResults;
  return Object.keys(pagination).length > 0 ? pagination : undefined;
}
