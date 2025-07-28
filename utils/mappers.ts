import {
  FeaturebaseUser,
  FeaturebasePostStatus,
  FeaturebasePostCategory,
  FeaturebaseChangelogCategory,
  FeaturebaseChange,
} from "../types.ts";

/**
 * Maps a Featurebase user object to the event payload format
 */
export function mapFeaturebaseUser(user: FeaturebaseUser) {
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
 * Maps a Featurebase post status object to the event payload format
 */
export function mapFeaturebasePostStatus(status: FeaturebasePostStatus) {
  return {
    name: status.name,
    color: status.color,
    type: status.type,
    isDefault: status.isDefault,
    id: status.id,
  };
}

/**
 * Maps a Featurebase post category object to the event payload format
 */
export function mapFeaturebasePostCategory(category: FeaturebasePostCategory) {
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
