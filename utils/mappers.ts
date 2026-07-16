import {
  FeaturebaseUser,
  FeaturebasePostStatus,
  FeaturebasePostCategory,
  FeaturebaseChangelogCategory,
  FeaturebaseChange,
} from "../types.ts";

/**
 * Maps a Featurebase user object to the event payload format.
 * Returns undefined when the payload carries no user.
 */
export function mapFeaturebaseUser(user: FeaturebaseUser | undefined | null) {
  if (!user) {
    return undefined;
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    profilePicture: user.profilePicture,
    verified: user.verified,
    type: user.type,
  };
}

/**
 * Maps a Featurebase post status to the event payload format.
 * Accepts a status object or a bare status id; a bare id maps to `{ id }`.
 */
export function mapFeaturebasePostStatus(
  status: FeaturebasePostStatus | string | undefined | null,
) {
  if (!status) {
    return undefined;
  }
  if (typeof status === "string") {
    return { id: status };
  }
  return {
    name: status.name,
    color: status.color,
    type: status.type,
    isDefault: status.isDefault,
    id: status.id,
  };
}

/**
 * Maps a Featurebase post category to the event payload format.
 * Accepts a category object or a bare board id; a bare id maps to `{ id }`.
 */
export function mapFeaturebasePostCategory(
  category: FeaturebasePostCategory | string | undefined | null,
) {
  if (!category) {
    return undefined;
  }
  if (typeof category === "string") {
    return { id: category };
  }
  return {
    name: category.category,
    private: category.private,
    icon: category.icon,
    id: category.id,
  };
}

/**
 * Maps Featurebase changelog categories to the event payload format
 */
export function mapFeaturebaseChangelogCategories(
  categories: FeaturebaseChangelogCategory[],
) {
  return categories.map((cat) => ({
    name: cat.name,
    color: cat.color,
    id: cat.id,
  }));
}

/**
 * Maps an array of Featurebase changes to the event payload format
 */
export function mapFeaturebaseChanges(changes: FeaturebaseChange[]) {
  return changes.map((change) => ({
    field: change.field,
    oldValue: change.oldValue,
    newValue: change.newValue,
  }));
}
