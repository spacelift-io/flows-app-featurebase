/**
 * Reusable JSON schema components for Featurebase webhook events.
 * These schemas define the structure of data types used across webhook payloads.
 */

export const featurebaseIdSchema = {
  type: "string",
  description: "Unique identifier in Featurebase (e.g., 'fb123abc').",
} as const;

export const featurebaseTimestampSchema = {
  type: "string",
  format: "date-time",
  description: "ISO 8601 timestamp (e.g., '2023-01-15T10:30:00Z').",
} as const;

export const featurebaseUserSchema = {
  type: "object",
  description: "Featurebase user object with profile information.",
  properties: {
    id: {
      ...featurebaseIdSchema,
      description: "Unique user ID in Featurebase.",
    },
    email: {
      type: "string",
      format: "email",
      description: "User's email address.",
    },
    name: {
      type: "string",
      description: "Display name of the user.",
    },
    profilePicture: {
      type: ["string", "null"],
      format: "uri",
      description: "URL to the user's profile picture, or null if not set.",
    },
    verified: {
      type: "boolean",
      description: "Whether the user's email address has been verified.",
    },
    type: {
      type: "string",
      enum: ["user", "admin", "member"],
      description: "User's role type in the organization.",
    },
  },
  required: ["id", "email", "name", "verified", "type"],
} as const;

export const featurebasePostStatusSchema = {
  type: "object",
  description:
    "Status information for a post (e.g., 'Under Review', 'In Progress', 'Completed').",
  properties: {
    name: {
      type: "string",
      description: "Display name of the status.",
    },
    color: {
      type: "string",
      pattern: "^#[0-9A-Fa-f]{6}$",
      description: "Hex color code for the status (e.g., '#FF5733').",
    },
    type: {
      type: "string",
      description: "Internal type identifier for the status.",
    },
    isDefault: {
      type: "boolean",
      description: "Whether this is the default status for new posts.",
    },
    id: {
      ...featurebaseIdSchema,
      description: "Unique status ID.",
    },
  },
  required: ["name", "color", "type", "isDefault", "id"],
} as const;

export const featurebasePostCategorySchema = {
  type: "object",
  description: "Category information for organizing posts.",
  properties: {
    name: {
      type: "string",
      description: "Display name of the category.",
    },
    private: {
      type: "boolean",
      description: "Whether this category is private to certain users.",
    },
    icon: {
      type: ["string", "null"],
      description: "Icon identifier or emoji for the category.",
    },
    id: {
      ...featurebaseIdSchema,
      description: "Unique category ID.",
    },
  },
  required: ["name", "private", "id"],
} as const;

/**
 * Post tag object schema
 */
export const postTagSchema = {
  type: "object" as const,
  properties: {
    name: { type: "string" as const },
    color: { type: "string" as const },
    private: { type: "boolean" as const },
    id: { type: "string" as const },
  },
};

export const featurebasePostSchema = {
  type: "object",
  description: "Complete post object with all associated data.",
  properties: {
    id: {
      ...featurebaseIdSchema,
      description: "Unique post ID.",
    },
    title: {
      type: "string",
      description: "Title of the post.",
    },
    content: {
      type: "string",
      description: "Full content/description of the post.",
    },
    slug: {
      type: "string",
      description: "URL-friendly slug for the post.",
    },
    upvotes: {
      type: "integer",
      minimum: 0,
      description: "Number of upvotes the post has received.",
    },
    commentCount: {
      type: "integer",
      minimum: 0,
      description: "Total number of comments on the post.",
    },
    pinned: {
      type: "boolean",
      description: "Whether the post is pinned to the top of its category.",
    },
    commentsAllowed: {
      type: "boolean",
      description: "Whether users can comment on this post.",
    },
    date: featurebaseTimestampSchema,
    lastModified: featurebaseTimestampSchema,
    lastUpvoted: {
      ...featurebaseTimestampSchema,
      description:
        "Timestamp of the most recent upvote, or null if never upvoted.",
      type: ["string", "null"],
    },
    user: featurebaseUserSchema,
    postStatus: featurebasePostStatusSchema,
    postCategory: featurebasePostCategorySchema,
    postTags: {
      type: "array",
      items: postTagSchema,
      description: "List of tags associated with the post.",
    },
  },
  required: [
    "id",
    "title",
    "content",
    "slug",
    "upvotes",
    "commentCount",
    "pinned",
    "commentsAllowed",
    "date",
    "lastModified",
    "user",
    "postStatus",
    "postCategory",
  ],
} as const;

export const featurebaseCommentSchema = {
  type: "object",
  description: "Comment object with user information and metadata.",
  properties: {
    id: {
      ...featurebaseIdSchema,
      description: "Unique comment ID.",
    },
    content: {
      type: "string",
      description: "Text content of the comment.",
    },
    isPrivate: {
      type: "boolean",
      description: "Whether this comment is private to admins/moderators.",
    },
    score: {
      type: "integer",
      description: "Comment score (upvotes minus downvotes).",
    },
    upvotes: {
      type: "integer",
      minimum: 0,
      description: "Number of upvotes on the comment.",
    },
    downvotes: {
      type: "integer",
      minimum: 0,
      description: "Number of downvotes on the comment.",
    },
    inReview: {
      type: "boolean",
      description: "Whether the comment is currently under moderation review.",
    },
    pinned: {
      type: "boolean",
      description:
        "Whether the comment is pinned to the top of the discussion.",
    },
    emailSent: {
      type: "boolean",
      description:
        "Whether notification emails have been sent for this comment.",
    },
    sendNotification: {
      type: "boolean",
      description: "Whether this comment should trigger notifications.",
    },
    createdAt: featurebaseTimestampSchema,
    updatedAt: featurebaseTimestampSchema,
    organization: {
      ...featurebaseIdSchema,
      description: "Organization ID this comment belongs to.",
    },
    postId: {
      ...featurebaseIdSchema,
      description: "ID of the post this comment belongs to.",
    },
    path: {
      type: "string",
      description: "Hierarchical path for nested comment threads.",
    },
    user: featurebaseUserSchema,
  },
  required: [
    "id",
    "content",
    "isPrivate",
    "score",
    "upvotes",
    "downvotes",
    "inReview",
    "pinned",
    "emailSent",
    "sendNotification",
    "createdAt",
    "updatedAt",
    "organization",
    "postId",
    "path",
    "user",
  ],
} as const;

export const featurebaseChangelogCategorySchema = {
  type: "object",
  description: "Category for changelog entries.",
  properties: {
    name: {
      type: "string",
      description: "Display name of the changelog category.",
    },
    color: {
      type: "string",
      pattern: "^#[0-9A-Fa-f]{6}$",
      description: "Hex color code for the category.",
    },
    id: {
      ...featurebaseIdSchema,
      description: "Unique category ID.",
    },
  },
  required: ["name", "color", "id"],
} as const;

export const featurebaseChangelogSchema = {
  type: "object",
  description: "Changelog entry with publication information.",
  properties: {
    id: {
      ...featurebaseIdSchema,
      description: "Unique changelog entry ID.",
    },
    title: {
      type: "string",
      description: "Title of the changelog entry.",
    },
    content: {
      type: "string",
      description: "HTML content of the changelog entry.",
    },
    markdownContent: {
      type: "string",
      description: "Markdown source content of the changelog entry.",
    },
    featuredImage: {
      type: ["string", "null"],
      format: "uri",
      description: "URL to the featured image, or null if not set.",
    },
    date: featurebaseTimestampSchema,
    state: {
      type: "string",
      enum: ["draft", "published", "archived"],
      description: "Publication state of the changelog entry.",
    },
    locale: {
      type: "string",
      description: "Language locale code (e.g., 'en', 'es', 'fr').",
    },
    slug: {
      type: "string",
      description: "URL-friendly slug for the changelog entry.",
    },
    firstPublishInLocale: {
      type: "boolean",
      description: "Whether this is the first publication in this locale.",
    },
    commentCount: {
      type: "integer",
      minimum: 0,
      description: "Number of comments on the changelog entry.",
    },
    isPublished: {
      type: "boolean",
      description: "Whether the changelog entry is currently published.",
    },
    availableLocales: {
      type: "array",
      items: { type: "string" },
      description: "List of locale codes this entry is available in.",
    },
    publishedLocales: {
      type: "array",
      items: { type: "string" },
      description: "List of locale codes this entry is published in.",
    },
    slugs: {
      type: "object",
      description: "Mapping of locale codes to their respective slugs.",
      additionalProperties: { type: "string" },
    },
    organization: {
      ...featurebaseIdSchema,
      description: "Organization ID this changelog belongs to.",
    },
    categories: {
      type: "array",
      items: featurebaseChangelogCategorySchema,
      description: "Categories assigned to this changelog entry.",
    },
  },
  required: [
    "id",
    "title",
    "content",
    "markdownContent",
    "date",
    "state",
    "locale",
    "slug",
    "firstPublishInLocale",
    "commentCount",
    "isPublished",
    "availableLocales",
    "publishedLocales",
    "slugs",
    "organization",
    "categories",
  ],
} as const;

export const featurebaseChangeSchema = {
  type: "object",
  description: "Represents a change made to a post or comment.",
  properties: {
    field: {
      type: "string",
      description: "Name of the field that was changed.",
    },
    oldValue: {
      type: ["string", "number", "boolean", "null"],
      description: "Previous value before the change.",
    },
    newValue: {
      type: ["string", "number", "boolean", "null"],
      description: "New value after the change.",
    },
  },
  required: ["field", "oldValue", "newValue"],
} as const;

export const featurebasePostVoteSchema = {
  type: "object",
  description: "Vote action on a post with user information.",
  properties: {
    action: {
      type: "string",
      enum: ["upvote", "downvote", "remove_vote"],
      description: "Type of vote action performed.",
    },
    postId: {
      ...featurebaseIdSchema,
      description: "ID of the post that was voted on.",
    },
    user: featurebaseUserSchema,
  },
  required: ["action", "postId", "user"],
} as const;

export const featurebaseWebhookEventBaseSchema = {
  type: "object",
  description: "Base properties present in all Featurebase webhook events.",
  properties: {
    type: {
      type: "string",
      description: "Event type matching the webhook topic.",
    },
    id: {
      ...featurebaseIdSchema,
      description: "Unique webhook event ID.",
    },
    organizationId: {
      ...featurebaseIdSchema,
      description: "Organization ID where the event occurred.",
    },
    webhookId: {
      ...featurebaseIdSchema,
      description: "ID of the webhook that generated this event.",
    },
    createdAt: featurebaseTimestampSchema,
    deliveryStatus: {
      type: "string",
      enum: ["pending", "delivered", "failed"],
      description: "Status of the webhook delivery.",
    },
  },
  required: [
    "type",
    "id",
    "organizationId",
    "webhookId",
    "createdAt",
    "deliveryStatus",
  ],
} as const;
