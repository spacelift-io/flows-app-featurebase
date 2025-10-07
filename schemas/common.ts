/**
 * Common schema definitions for FeatureBase blocks to reduce duplication
 */

import {
  featurebasePostSchema,
  featurebaseCommentSchema,
  featurebaseChangelogSchema,
  featurebaseChangelogCategorySchema,
  featurebasePostCategorySchema,
  featurebasePostStatusSchema,
} from "../jsonschema/jsonschema.ts";

/**
 * Standard pagination schema used across list operations
 */
export const paginationSchema = {
  type: "object" as const,
  description: "Pagination information",
  properties: {
    page: { type: "number" as const, description: "Current page number" },
    limit: { type: "number" as const, description: "Items per page" },
    totalPages: {
      type: "number" as const,
      description: "Total number of pages",
    },
    totalResults: {
      type: "number" as const,
      description: "Total number of results",
    },
  },
  required: ["page", "limit", "totalPages", "totalResults"],
};

/**
 * Standard success field used in all output schemas
 */
export const successField = {
  type: "boolean" as const,
  description: "Whether the operation was successful",
};

/**
 * Post category object schema (from comprehensive webhook schemas)
 */
export const postCategorySchema = featurebasePostCategorySchema as any;

/**
 * Post status object schema (from comprehensive webhook schemas)
 */
export const postStatusSchema = featurebasePostStatusSchema as any;

/**
 * Complete post object schema (from comprehensive webhook schemas)
 * This provides the accurate, canonical representation of post objects
 */
export const postSchema = featurebasePostSchema as any;

/**
 * Comment object schema (from comprehensive webhook schemas)
 * This provides the accurate, canonical representation of comment objects
 */
export const commentSchema = featurebaseCommentSchema as any;

/**
 * Webhook event payload builders for consistent mapping
 */
import {
  mapFeaturebaseUser,
  mapFeaturebasePostStatus,
  mapFeaturebasePostCategory,
  mapFeaturebaseChangelogCategories,
  mapFeaturebaseChanges,
} from "../utils/mappers.ts";
import {
  FeaturebasePost,
  FeaturebaseComment,
  FeaturebaseChangelog,
  FeaturebaseWebhookEvent,
  FeaturebasePostVote,
} from "../types.ts";

/**
 * Builds post event payload from Featurebase post data
 */
export function buildPostEventPayload(item: FeaturebasePost) {
  return {
    post: {
      id: item.id,
      title: item.title,
      content: item.content,
      slug: item.slug,
      upvotes: item.upvotes,
      commentCount: item.commentCount,
      pinned: item.pinned,
      commentsAllowed: item.commentsAllowed,
      date: item.date,
      lastModified: item.lastModified,
      lastUpvoted: item.lastUpvoted,
      user: mapFeaturebaseUser(item.user),
      status: mapFeaturebasePostStatus(item.postStatus),
      category: mapFeaturebasePostCategory(item.postCategory),
    },
  };
}

/**
 * Builds post updated event payload with changes
 */
export function buildPostUpdatedEventPayload(
  item: FeaturebasePost,
  payload: FeaturebaseWebhookEvent,
) {
  return {
    ...buildPostEventPayload(item),
    changes: mapFeaturebaseChanges(payload.data.changes || []),
  };
}

/**
 * Builds comment event payload from Featurebase comment data
 */
export function buildCommentEventPayload(item: FeaturebaseComment) {
  return {
    comment: {
      id: item.id,
      content: item.content,
      isPrivate: item.isPrivate,
      score: item.score,
      upvotes: item.upvotes,
      downvotes: item.downvotes,
      inReview: item.inReview,
      pinned: item.pinned,
      emailSent: item.emailSent,
      sendNotification: item.sendNotification,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      organization: item.organization,
      postId: item.submission,
      path: item.path,
      user: mapFeaturebaseUser(item.user),
    },
  };
}

/**
 * Builds comment updated event payload with changes
 */
export function buildCommentUpdatedEventPayload(
  item: FeaturebaseComment,
  payload: FeaturebaseWebhookEvent,
) {
  return {
    ...buildCommentEventPayload(item),
    changes: mapFeaturebaseChanges(payload.data.changes || []),
  };
}

/**
 * Builds changelog event payload from Featurebase changelog data
 */
export function buildChangelogEventPayload(item: FeaturebaseChangelog) {
  return {
    changelog: {
      id: item.id,
      title: item.title,
      content: item.content,
      markdownContent: item.markdownContent,
      featuredImage: item.featuredImage,
      date: item.date,
      state: item.state,
      locale: item.locale,
      slug: item.slug,
      firstPublishInLocale: item.firstPublishInLocale,
      commentCount: item.commentCount,
      isPublished: item.isPublished,
      availableLocales: item.availableLocales,
      publishedLocales: item.publishedLocales,
      slugs: item.slugs,
      organization: item.organization,
      categories: mapFeaturebaseChangelogCategories(item.changelogCategories),
    },
  };
}

/**
 * Builds vote event payload from Featurebase vote data
 */
export function buildVoteEventPayload(item: FeaturebasePostVote) {
  return {
    vote: {
      action: item.action,
      postId: item.submissionId,
      user: mapFeaturebaseUser(item.user),
    },
  };
}

/**
 * Common output schema builders for consistent structure
 */
export const buildListPostsOutput = () => ({
  type: "object" as const,
  properties: {
    posts: {
      type: "array" as const,
      description: "Array of posts matching the criteria",
      items: postSchema,
    },
    pagination: paginationSchema,
    success: successField,
  },
  required: ["posts", "pagination", "success"],
});

export const buildCreatePostOutput = () => ({
  type: "object" as const,
  properties: {
    post: {
      ...postSchema,
      description: "The created post details",
    },
    success: successField,
  },
  required: ["post", "success"],
});

export const buildListCommentsOutput = () => ({
  type: "object" as const,
  properties: {
    comments: {
      type: "array" as const,
      description: "Array of comments matching the criteria",
      items: commentSchema,
    },
    pagination: paginationSchema,
    filters: {
      type: "object" as const,
      description: "Applied filters",
      properties: {
        submissionId: {
          type: "string" as const,
          description: "Post ID filter",
        },
        changelogId: {
          type: "string" as const,
          description: "Changelog ID filter",
        },
        privacy: { type: "string" as const, description: "Privacy filter" },
        inReview: { type: "boolean" as const, description: "In review filter" },
        commentThreadId: {
          type: "string" as const,
          description: "Thread ID filter",
        },
        sortBy: { type: "string" as const, description: "Sort order" },
      },
    },
    success: successField,
  },
  required: ["comments", "pagination", "filters", "success"],
});

export const buildCreateCommentOutput = () => ({
  type: "object" as const,
  properties: {
    comment: {
      ...commentSchema,
      description: "The created comment object",
    },
    success: successField,
    submissionId: {
      type: "string" as const,
      description: "Post ID the comment was added to",
    },
    changelogId: {
      type: "string" as const,
      description: "Changelog ID the comment was added to",
    },
    parentCommentId: {
      type: "string" as const,
      description: "Parent comment ID if this is a reply",
    },
    isReply: {
      type: "boolean" as const,
      description: "Whether this comment is a reply",
    },
    createdAt: {
      type: "string" as const,
      description: "Timestamp when the comment was created",
    },
  },
  required: ["comment", "success", "isReply", "createdAt"],
});

export const buildUpdatePostOutput = () => ({
  type: "object" as const,
  properties: {
    postId: {
      type: "string" as const,
      description: "The ID of the updated post",
    },
    success: successField,
    updatedFields: {
      type: "array" as const,
      description: "List of fields that were updated",
      items: { type: "string" as const },
    },
  },
  required: ["postId", "success", "updatedFields"],
});

export const buildDeletePostOutput = () => ({
  type: "object" as const,
  properties: {
    postId: {
      type: "string" as const,
      description: "The ID of the deleted post",
    },
    success: successField,
    deletedAt: {
      type: "string" as const,
      description: "Timestamp when the deletion occurred (ISO format)",
    },
  },
  required: ["postId", "success", "deletedAt"],
});

export const buildUpdateCommentOutput = () => ({
  type: "object" as const,
  properties: {
    commentId: {
      type: "string" as const,
      description: "The ID of the updated comment",
    },
    updatedFields: {
      type: "array" as const,
      description: "List of fields that were updated",
      items: {
        type: "string" as const,
        enum: ["content", "isPrivate", "pinned", "inReview", "createdAt"],
      },
    },
    updates: {
      type: "object" as const,
      description: "The actual values that were updated",
      properties: {
        content: { type: "string" as const, description: "Updated content" },
        isPrivate: {
          type: "boolean" as const,
          description: "Updated privacy setting",
        },
        pinned: {
          type: "boolean" as const,
          description: "Updated pinned status",
        },
        inReview: {
          type: "boolean" as const,
          description: "Updated review status",
        },
        createdAt: {
          type: "string" as const,
          description: "Updated creation date",
        },
      },
    },
    success: successField,
    updatedAt: {
      type: "string" as const,
      description: "Timestamp when the update occurred (ISO format)",
    },
  },
  required: ["commentId", "updatedFields", "updates", "success", "updatedAt"],
});

export const buildDeleteCommentOutput = () => ({
  type: "object" as const,
  properties: {
    commentId: {
      type: "string" as const,
      description: "The ID of the deleted comment",
    },
    success: successField,
    deletedAt: {
      type: "string" as const,
      description: "Timestamp when the deletion occurred (ISO format)",
    },
    note: {
      type: "string" as const,
      description:
        "Information about soft deletion behavior for comments with replies",
    },
  },
  required: ["commentId", "success", "deletedAt", "note"],
});

export const buildGetPostOutput = () => ({
  type: "object" as const,
  properties: {
    post: {
      ...postSchema,
      description: "The retrieved post details",
      additionalProperties: true,
    },
    success: successField,
    found: {
      type: "boolean" as const,
      description: "Whether the post was found",
    },
  },
  required: ["post", "success", "found"],
});

/**
 * Changelog category schema (from comprehensive webhook schemas)
 */
export const changelogCategorySchema =
  featurebaseChangelogCategorySchema as any;

/**
 * Changelog object schema (from comprehensive webhook schemas)
 * This provides the accurate, canonical representation of changelog objects
 */
export const changelogSchema = featurebaseChangelogSchema as any;

/**
 * Changelog output schema builders for consistent structure
 */
export const buildListChangelogsOutput = () => ({
  type: "object" as const,
  properties: {
    changelogs: {
      type: "array" as const,
      description: "Array of changelogs matching the criteria",
      items: changelogSchema,
    },
    pagination: paginationSchema,
    success: successField,
  },
  required: ["changelogs", "pagination", "success"],
});

export const buildGetChangelogOutput = () => ({
  type: "object" as const,
  properties: {
    changelog: {
      ...changelogSchema,
      description: "The retrieved changelog details",
    },
    success: successField,
    found: {
      type: "boolean" as const,
      description: "Whether the changelog was found",
    },
  },
  required: ["changelog", "success", "found"],
});

export const buildCreateChangelogOutput = () => ({
  type: "object" as const,
  properties: {
    changelog: {
      ...changelogSchema,
      description: "The created changelog details",
    },
    success: successField,
  },
  required: ["changelog", "success"],
});

export const buildUpdateChangelogOutput = () => ({
  type: "object" as const,
  properties: {
    changelogId: {
      type: "string" as const,
      description: "The ID of the updated changelog",
    },
    success: successField,
    updatedFields: {
      type: "array" as const,
      description: "List of fields that were updated",
      items: { type: "string" as const },
    },
  },
  required: ["changelogId", "success", "updatedFields"],
});

export const buildDeleteChangelogOutput = () => ({
  type: "object" as const,
  properties: {
    changelogId: {
      type: "string" as const,
      description: "The ID of the deleted changelog",
    },
    success: successField,
    deletedAt: {
      type: "string" as const,
      description: "Timestamp when the deletion occurred (ISO format)",
    },
  },
  required: ["changelogId", "success", "deletedAt"],
});

export const buildPublishChangelogOutput = () => ({
  type: "object" as const,
  properties: {
    changelogId: {
      type: "string" as const,
      description: "The ID of the published changelog",
    },
    success: successField,
    publishedAt: {
      type: "string" as const,
      description: "Timestamp when the changelog was published (ISO format)",
    },
    emailSent: {
      type: "boolean" as const,
      description: "Whether email notifications were sent",
    },
    locales: {
      type: "array" as const,
      description: "Locales the changelog was published to",
      items: { type: "string" as const },
    },
  },
  required: ["changelogId", "success", "publishedAt", "emailSent"],
});

export const buildUnpublishChangelogOutput = () => ({
  type: "object" as const,
  properties: {
    changelogId: {
      type: "string" as const,
      description: "The ID of the unpublished changelog",
    },
    success: successField,
    unpublishedAt: {
      type: "string" as const,
      description: "Timestamp when the changelog was unpublished (ISO format)",
    },
    locales: {
      type: "array" as const,
      description: "Locales the changelog was unpublished from",
      items: { type: "string" as const },
    },
  },
  required: ["changelogId", "success", "unpublishedAt"],
});

export const buildGetChangelogSubscribersOutput = () => ({
  type: "object" as const,
  properties: {
    emails: {
      type: "array" as const,
      description: "Array of subscriber email addresses",
      items: { type: "string" as const },
    },
    success: successField,
    totalSubscribers: {
      type: "number" as const,
      description: "Total number of subscribers",
    },
  },
  required: ["emails", "success", "totalSubscribers"],
});

export const buildAddChangelogSubscribersOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    addedEmails: {
      type: "array" as const,
      description: "Array of email addresses that were added",
      items: { type: "string" as const },
    },
    addedCount: {
      type: "number" as const,
      description: "Number of subscribers added",
    },
    locale: {
      type: "string" as const,
      description: "Locale the subscribers were added to",
    },
  },
  required: ["success", "addedEmails", "addedCount"],
});

export const buildRemoveChangelogSubscribersOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    removedEmails: {
      type: "array" as const,
      description: "Array of email addresses that were removed",
      items: { type: "string" as const },
    },
    removedCount: {
      type: "number" as const,
      description: "Number of subscribers removed",
    },
    locale: {
      type: "string" as const,
      description: "Locale the subscribers were removed from",
    },
  },
  required: ["success", "removedEmails", "removedCount"],
});

/**
 * Shared schemas for roles functionality
 */
export const emailsArraySchema = {
  type: "array" as const,
  description: "Array of email addresses",
  items: { type: "string" as const, format: "email" },
  minItems: 1,
};

export const rolesArraySchema = {
  type: "array" as const,
  description: "Array of role names",
  items: { type: "string" as const },
  minItems: 1,
};

/**
 * Roles output schema builders for consistent structure
 */
export const buildAddUsersToRolesOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
  },
  required: ["success"],
});

export const buildRemoveUsersFromRolesOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
  },
  required: ["success"],
});

/**
 * Admin object schema used in list and get operations
 */
export const adminSchema = {
  type: "object" as const,
  description: "Admin user information",
  properties: {
    id: {
      type: "string" as const,
      description: "The unique identifier of the admin",
    },
    name: { type: "string" as const, description: "The name of the admin" },
    email: {
      type: "string" as const,
      description: "The email address of the admin",
    },
    picture: {
      type: "string" as const,
      description: "The URL to the profile picture of the admin",
    },
    roleId: {
      type: "string" as const,
      description: "The unique identifier of the admin's role",
    },
  },
  required: ["id", "name", "email", "picture", "roleId"],
};

/**
 * Admin role permissions schema
 */
export const adminRolePermissionsSchema = {
  type: "object" as const,
  description: "Admin role permissions",
  properties: {
    view_comments_private: { type: "boolean" as const },
    manage_comments: { type: "boolean" as const },
    manage_comments_private: { type: "boolean" as const },
    set_comment_pinned: { type: "boolean" as const },
    moderate_comments: { type: "boolean" as const },
    set_post_category: { type: "boolean" as const },
    set_post_pinned: { type: "boolean" as const },
    set_post_eta: { type: "boolean" as const },
    set_post_tags: { type: "boolean" as const },
    set_post_author: { type: "boolean" as const },
    set_post_status: { type: "boolean" as const },
    set_post_assignee: { type: "boolean" as const },
    set_post_custom_fields: { type: "boolean" as const },
    post_vote_on_behalf: { type: "boolean" as const },
    post_merge: { type: "boolean" as const },
    post_import: { type: "boolean" as const },
    post_export: { type: "boolean" as const },
    moderate_posts: { type: "boolean" as const },
    view_users: { type: "boolean" as const },
    manage_users: { type: "boolean" as const },
    view_posts_private: { type: "boolean" as const },
    view_private_post_tags: { type: "boolean" as const },
    manage_changelogs: { type: "boolean" as const },
    manage_surveys: { type: "boolean" as const },
    manage_branding: { type: "boolean" as const },
    manage_billing: { type: "boolean" as const },
    manage_team_members: { type: "boolean" as const },
    manage_sso: { type: "boolean" as const },
    manage_api: { type: "boolean" as const },
    manage_statuses: { type: "boolean" as const },
    manage_boards: { type: "boolean" as const },
    manage_post_tags: { type: "boolean" as const },
    manage_custom_fields: { type: "boolean" as const },
    manage_moderation_settings: { type: "boolean" as const },
    manage_roadmap: { type: "boolean" as const },
    manage_user_roles: { type: "boolean" as const },
    manage_prioritization: { type: "boolean" as const },
    manage_notifications: { type: "boolean" as const },
    manage_custom_domain: { type: "boolean" as const },
    manage_integrations: { type: "boolean" as const },
    use_integrations: { type: "boolean" as const },
    manage_help_center: { type: "boolean" as const },
    auto_approve_posts: { type: "boolean" as const },
  },
};

/**
 * Admin role object schema
 */
export const adminRoleSchema = {
  type: "object" as const,
  description: "Admin role information with permissions",
  properties: {
    name: {
      type: "string" as const,
      description: "The name of the admin role",
    },
    permissions: adminRolePermissionsSchema,
    _id: {
      type: "string" as const,
      description: "The unique identifier of the role",
    },
  },
  required: ["name", "permissions", "_id"],
};

/**
 * Admin output schema builders for consistent structure
 */
export const buildListAdminsOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    results: {
      type: "array" as const,
      description: "Array of admin users",
      items: adminSchema,
    },
  },
  required: ["success", "results"],
});

export const buildGetAdminOutput = () => ({
  type: "object" as const,
  properties: {
    ...adminSchema.properties,
  },
  required: adminSchema.required,
});

export const buildListAdminRolesOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    results: {
      type: "array" as const,
      description: "Array of admin roles with permissions",
      items: adminRoleSchema,
    },
  },
  required: ["success", "results"],
});

/**
 * Board object schema used in list and get operations
 */
export const boardSchema = {
  type: "object" as const,
  description: "Board information",
  properties: {
    id: {
      type: "string" as const,
      description: "The unique identifier of the board",
    },
    category: {
      type: "string" as const,
      description: "The name of the board/category",
    },
    private: {
      type: "boolean" as const,
      description: "Flag indicating whether this board is private",
    },
    segmentIds: {
      type: "array" as const,
      description: "An array of segment IDs associated with this board",
      items: { type: "string" as const },
    },
    roles: {
      type: "array" as const,
      description: "An array of roles that have access to this board",
      items: { type: "string" as const },
    },
    hiddenFromRoles: {
      type: "array" as const,
      description: "An array of roles that cannot see this board",
      items: { type: "string" as const },
    },
    disablePostCreation: {
      type: "boolean" as const,
      description:
        "Flag indicating whether post creation is disabled for this board",
    },
    disableFollowUpQuestions: {
      type: "boolean" as const,
      description:
        "Flag indicating whether follow-up questions are disabled for this board",
    },
    customInputFields: {
      type: "array" as const,
      description:
        "An array of custom input fields ids that apply to this board",
      items: { type: "string" as const },
    },
    defaultAuthorOnly: {
      type: "boolean" as const,
      description:
        "Flag indicating whether posts in this board are visible to the author only by default",
    },
    defaultCompanyOnly: {
      type: "boolean" as const,
      description:
        "Flag indicating whether posts in this board are visible to the company only by default",
    },
    icon: {
      type: ["object", "null"] as const,
      description: "The icon associated with this board. Can be null.",
    },
  },
  required: [
    "id",
    "category",
    "private",
    "segmentIds",
    "roles",
    "hiddenFromRoles",
    "disablePostCreation",
    "disableFollowUpQuestions",
    "customInputFields",
    "defaultAuthorOnly",
    "defaultCompanyOnly",
  ],
};

/**
 * Board output schema builders for consistent structure
 */
export const buildListBoardsOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    results: {
      type: "array" as const,
      description: "Array of boards",
      items: boardSchema,
    },
  },
  required: ["success", "results"],
});

export const buildGetBoardOutput = () => ({
  type: "object" as const,
  properties: {
    ...boardSchema.properties,
  },
  required: boardSchema.required,
});

/**
 * Custom field object schema used in list and get operations
 */
export const customFieldSchema = {
  type: "object" as const,
  description: "Custom field configuration information",
  properties: {
    _id: {
      type: "string" as const,
      description: "The unique identifier of the custom field",
    },
    label: {
      type: "string" as const,
      description: "The label displayed for the custom field",
    },
    type: {
      type: "string" as const,
      description: "The type of the custom field",
      enum: ["text", "date", "number", "select", "multi-select", "checkbox"],
    },
    required: {
      type: "boolean" as const,
      description:
        "Flag indicating whether this field is required during post submission",
    },
    placeholder: {
      type: "string" as const,
      description: "Optional placeholder text shown in the field",
    },
    public: {
      type: "boolean" as const,
      description: "Flag indicating whether this field is publicly visible",
    },
    internal: {
      type: "boolean" as const,
      description:
        "Flag indicating whether this field is for internal use only",
    },
    options: {
      type: "array" as const,
      description:
        "For field types that support options (like 'select', 'multi-select', 'checkbox'), this contains the available choices",
      items: { type: "string" as const },
    },
    createdAt: {
      type: "string" as const,
      description: "The timestamp when the custom field was created",
    },
    updatedAt: {
      type: "string" as const,
      description: "The timestamp when the custom field was last updated",
    },
  },
  required: [
    "_id",
    "label",
    "type",
    "required",
    "placeholder",
    "public",
    "internal",
    "options",
    "createdAt",
    "updatedAt",
  ],
};

/**
 * Custom field output schema builders for consistent structure
 */
export const buildListCustomFieldsOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    results: {
      type: "array" as const,
      description: "Array of custom fields",
      items: customFieldSchema,
    },
  },
  required: ["success", "results"],
});

export const buildGetCustomFieldOutput = () => ({
  type: "object" as const,
  properties: {
    ...customFieldSchema.properties,
  },
  required: customFieldSchema.required,
});

export const buildResolveCustomFieldsOutput = () => ({
  type: "array" as const,
  description: "Array of resolved custom fields with non-empty values",
  items: {
    type: "object" as const,
    properties: {
      label: {
        type: "string" as const,
        description: "Human-readable label for the custom field",
      },
      value: {
        description: "Human-readable value (option IDs resolved to labels)",
      },
    },
    required: ["label", "value"],
  },
});

/**
 * Survey targeting object schema used in survey data
 */
export const surveyTargetingSchema = {
  type: "object" as const,
  description: "Survey targeting configuration",
  properties: {
    segmentIds: {
      type: "array" as const,
      description: "Array of segment IDs associated with this survey",
      items: { type: "string" as const },
    },
    url: {
      type: "array" as const,
      description: "Array of URL targeting rules",
      items: {
        type: "object" as const,
        properties: {
          value: {
            type: "string" as const,
            description: "URL pattern to match",
          },
          matchType: {
            type: "string" as const,
            description: "How to match the URL (exact, contains, etc.)",
          },
          _id: {
            type: "string" as const,
            description: "Unique identifier for this rule",
          },
        },
        required: ["value", "matchType", "_id"],
      },
    },
    css: {
      type: "array" as const,
      description: "Array of CSS selector targeting rules",
      items: { type: "string" as const },
    },
    loginRequired: {
      type: "boolean" as const,
      description: "Flag indicating whether user must be logged in",
    },
  },
  required: ["segmentIds", "url", "css", "loginRequired"],
};

/**
 * Survey page logic object schema
 */
export const surveyPageLogicSchema = {
  type: "object" as const,
  description: "Survey page conditional logic",
  properties: {
    comparator: {
      type: "string" as const,
      description: "Comparison operator (e.g., 'less than', 'equal to')",
    },
    value: { type: "number" as const, description: "Value to compare against" },
    next: {
      type: "object" as const,
      description: "Action to take when condition is met",
      properties: {
        type: {
          type: "string" as const,
          description: "Type of action (e.g., 'page', 'end')",
        },
        pageId: {
          type: "string" as const,
          description: "Target page ID if type is 'page'",
        },
      },
      required: ["type"],
    },
    _id: {
      type: "string" as const,
      description: "Unique identifier for this logic rule",
    },
  },
  required: ["comparator", "value", "next", "_id"],
};

/**
 * Survey page default action schema
 */
export const surveyPageDefaultActionSchema = {
  type: "object" as const,
  description: "Default action for survey page",
  properties: {
    type: {
      type: "string" as const,
      description: "Type of action ('page', 'end')",
    },
    pageId: {
      type: "string" as const,
      description: "Target page ID if type is 'page'",
    },
  },
  required: ["type"],
};

/**
 * Survey page object schema
 */
export const surveyPageSchema = {
  type: "object" as const,
  description: "Survey page information",
  properties: {
    type: {
      type: "string" as const,
      description: "Type of survey page",
      enum: ["rating", "text", "multiple-choice", "checkbox"],
    },
    title: { type: "string" as const, description: "Title of the survey page" },
    description: {
      type: "string" as const,
      description: "Description or additional information for the page",
    },
    subType: {
      type: "string" as const,
      description: "Sub-type of the page (e.g., 'emoji' for rating pages)",
    },
    scale: {
      type: "number" as const,
      description: "Scale for rating pages (e.g., 1-5, 1-10)",
    },
    lowLabel: {
      type: "string" as const,
      description: "Label for the low end of rating scale",
    },
    highLabel: {
      type: "string" as const,
      description: "Label for the high end of rating scale",
    },
    placeholder: {
      type: "string" as const,
      description: "Placeholder text for text input pages",
    },
    logic: {
      type: "array" as const,
      description: "Array of conditional logic rules for the page",
      items: surveyPageLogicSchema,
    },
    defaultAction: surveyPageDefaultActionSchema,
    _id: {
      type: "string" as const,
      description: "Unique identifier of the survey page",
    },
  },
  required: ["type", "title", "logic", "defaultAction", "_id"],
};

/**
 * Complete survey object schema used in list and get operations
 */
export const surveySchema = {
  type: "object" as const,
  description: "Survey information",
  properties: {
    _id: {
      type: "string" as const,
      description: "The unique identifier of the survey",
    },
    title: { type: "string" as const, description: "The title of the survey" },
    description: {
      type: "string" as const,
      description: "A description of the survey's purpose",
    },
    isActive: {
      type: "boolean" as const,
      description: "Flag indicating whether the survey is currently active",
    },
    helpcenterMode: {
      type: "boolean" as const,
      description: "Flag indicating whether the survey is in help center mode",
    },
    organization: {
      type: "string" as const,
      description: "The ID of the organization that owns the survey",
    },
    articleId: {
      type: ["string", "null"] as const,
      description: "The ID of the associated article (null if not associated)",
    },
    articleHelpCenterId: {
      type: ["string", "null"] as const,
      description:
        "The ID of the associated help center article (null if not associated)",
    },
    responseCount: {
      type: "number" as const,
      description: "The number of responses received for this survey",
    },
    targeting: surveyTargetingSchema,
    pages: {
      type: "array" as const,
      description: "Array of survey pages (questions)",
      items: surveyPageSchema,
    },
    createdAt: {
      type: "string" as const,
      description: "The timestamp when the survey was created",
    },
    updatedAt: {
      type: "string" as const,
      description: "The timestamp when the survey was last updated",
    },
    __v: {
      type: "number" as const,
      description: "Version number for the survey document",
    },
  },
  required: [
    "_id",
    "title",
    "description",
    "isActive",
    "organization",
    "responseCount",
    "targeting",
    "pages",
    "createdAt",
    "updatedAt",
  ],
};

/**
 * Survey response user object schema
 */
export const surveyResponseUserSchema = {
  type: "object" as const,
  description: "User information in survey response",
  properties: {
    id: {
      type: "string" as const,
      description: "The user ID in the response context",
    },
    userId: {
      type: "string" as const,
      description: "The actual user identifier",
    },
    organizationId: {
      type: "string" as const,
      description: "Organization ID the user belongs to",
    },
    customFields: {
      type: "object" as const,
      description: "Custom fields associated with the user",
      additionalProperties: true,
    },
    companies: {
      type: "array" as const,
      description: "Array of companies associated with the user",
      items: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const, description: "Company ID" },
          name: { type: "string" as const, description: "Company name" },
          monthlySpend: {
            type: "number" as const,
            description: "Monthly spend amount",
          },
          createdAt: {
            type: "string" as const,
            description: "Company creation timestamp",
          },
          _id: { type: "string" as const, description: "Internal company ID" },
        },
        required: ["id", "name", "monthlySpend", "createdAt", "_id"],
      },
    },
    email: { type: "string" as const, description: "User email address" },
    name: { type: "string" as const, description: "User display name" },
    profilePicture: {
      type: "string" as const,
      description: "URL to user's profile picture",
    },
    commentsCreated: {
      type: "number" as const,
      description: "Number of comments created by the user",
    },
    postsCreated: {
      type: "number" as const,
      description: "Number of posts created by the user",
    },
    lastActivity: {
      type: "string" as const,
      description: "Timestamp of user's last activity",
    },
    subscribedToChangelog: {
      type: "boolean" as const,
      description: "Whether user is subscribed to changelog",
    },
    manuallyOptedOutFromChangelog: {
      type: "boolean" as const,
      description: "Whether user manually opted out from changelog",
    },
    roles: {
      type: "array" as const,
      description: "Array of roles assigned to the user",
      items: { type: "string" as const },
    },
    locale: { type: "string" as const, description: "User's locale setting" },
    verified: {
      type: "boolean" as const,
      description: "Whether user's email is verified",
    },
    type: { type: "string" as const, description: "Type of user account" },
    description: {
      type: "string" as const,
      description: "User description or bio",
    },
  },
  required: [
    "id",
    "userId",
    "organizationId",
    "email",
    "name",
    "commentsCreated",
    "postsCreated",
    "lastActivity",
    "subscribedToChangelog",
    "roles",
    "locale",
    "verified",
    "type",
  ],
};

/**
 * Survey response answer object schema
 */
export const surveyResponseAnswerSchema = {
  type: "object" as const,
  description: "Individual response answer",
  properties: {
    pageId: {
      type: "string" as const,
      description: "ID of the survey page this response answers",
    },
    type: {
      type: "string" as const,
      description: "Type of response (text, multiple-choice, etc.)",
    },
    value: {
      type: ["string", "number", "array"] as const,
      description: "The actual response value",
    },
    _id: {
      type: "string" as const,
      description: "Unique identifier for this response",
    },
    createdAt: {
      type: "string" as const,
      description: "When this response was created",
    },
    updatedAt: {
      type: "string" as const,
      description: "When this response was last updated",
    },
  },
  required: ["pageId", "type", "value", "_id", "createdAt", "updatedAt"],
};

/**
 * Complete survey response object schema
 */
export const surveyResponseSchema = {
  type: "object" as const,
  description: "Survey response information",
  properties: {
    _id: {
      type: "string" as const,
      description: "Unique identifier of the survey response",
    },
    user: surveyResponseUserSchema,
    responses: {
      type: "array" as const,
      description: "Array of individual answers to survey questions",
      items: surveyResponseAnswerSchema,
    },
    createdAt: {
      type: "string" as const,
      description: "When the survey response was created",
    },
  },
  required: ["_id", "user", "responses", "createdAt"],
};

/**
 * Survey output schema builders for consistent structure
 */
export const buildListSurveysOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    results: {
      type: "array" as const,
      description: "Array of surveys",
      items: surveySchema,
    },
  },
  required: ["success", "results"],
});

export const buildGetSurveyOutput = () => ({
  type: "object" as const,
  properties: {
    ...surveySchema.properties,
  },
  required: surveySchema.required,
});

export const buildGetSurveyResponsesOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    results: {
      type: "array" as const,
      description: "Array of survey responses",
      items: surveyResponseSchema,
    },
  },
  required: ["success", "results"],
});

/**
 * Company object schema for identified users
 */
export const identifyUserCompanySchema = {
  type: "object" as const,
  description: "Company information associated with a user",
  properties: {
    id: { type: "string" as const, description: "Company ID" },
    name: { type: "string" as const, description: "Company name" },
    monthlySpend: {
      type: "number" as const,
      description: "Monthly recurring revenue from this company",
    },
    createdAt: {
      type: "string" as const,
      description: "Date when the company was created",
    },
    customFields: {
      type: "object" as const,
      description: "Object containing key-value pairs of custom fields",
      additionalProperties: true,
    },
    _id: { type: "string" as const, description: "Internal company ID" },
  },
  required: ["id", "name", "monthlySpend", "createdAt"],
};

/**
 * Role details object schema for identified users
 */
export const identifyUserRoleDetailsSchema = {
  type: "object" as const,
  description: "Role details for enterprise users",
  properties: {
    name: { type: "string" as const, description: "The name of the role" },
    id: {
      type: "string" as const,
      description: "The unique identifier of the role",
    },
  },
  required: ["name", "id"],
};

/**
 * Complete identified user object schema
 */
export const identifiedUserSchema = {
  type: "object" as const,
  description: "Identified user information",
  properties: {
    _id: {
      type: "string" as const,
      description: "Internal Featurebase user ID",
    },
    fbUserId: { type: "string" as const, description: "Featurebase user ID" },
    organization: {
      type: "string" as const,
      description: "Organization subdomain",
    },
    userId: { type: "string" as const, description: "Your own ID of the user" },
    externalUserId: {
      type: "string" as const,
      description: "External user ID",
    },
    id: { type: "string" as const, description: "User ID" },
    name: { type: "string" as const, description: "User name" },
    email: { type: "string" as const, description: "User email address" },
    profilePicture: {
      type: "string" as const,
      description: "URL to profile picture",
    },
    customFields: {
      type: "object" as const,
      description: "Object containing key-value pairs of custom fields",
      additionalProperties: true,
    },
    companies: {
      type: "array" as const,
      description: "Array of companies this user is associated with",
      items: identifyUserCompanySchema,
    },
    roleDetails: {
      ...identifyUserRoleDetailsSchema,
      description:
        "Role details for enterprise users (only sent for enterprise users with roles set up)",
    },
    commentsCreated: {
      type: "number" as const,
      description: "Number of comments created by the user",
    },
    postsCreated: {
      type: "number" as const,
      description: "Number of posts created by the user",
    },
    lastActivity: {
      type: "string" as const,
      description: "Timestamp of user's last activity",
    },
    subscribedToChangelog: {
      type: "boolean" as const,
      description: "Whether user is subscribed to changelog",
    },
    manuallyOptedOutFromChangelog: {
      type: "boolean" as const,
      description: "Whether user manually opted out from changelog",
    },
    roles: {
      type: "array" as const,
      description: "Array of roles assigned to the user",
      items: { type: "string" as const },
    },
    locale: { type: "string" as const, description: "User's locale setting" },
    verified: {
      type: "boolean" as const,
      description: "Whether user's email is verified",
    },
    type: { type: "string" as const, description: "Type of user account" },
    description: {
      type: "string" as const,
      description: "User description or bio",
    },
    createdAt: {
      type: "string" as const,
      description: "Date when the user was created",
    },
    updatedAt: {
      type: "string" as const,
      description: "Date when the user was last updated",
    },
    __v: {
      type: "number" as const,
      description: "Version number for the user document",
    },
  },
  required: ["email", "name"],
};

/**
 * Identify users output schema builders for consistent structure
 */
export const buildGetIdentifyUserOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    user: identifiedUserSchema,
  },
  required: ["success", "user"],
});

export const buildQueryIdentifyUsersOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    results: {
      type: "array" as const,
      description: "Array of identified users",
      items: identifiedUserSchema,
    },
    page: { type: "number" as const, description: "Current page number" },
    limit: { type: "number" as const, description: "Number of users per page" },
    totalResults: {
      type: "number" as const,
      description: "Total number of users",
    },
  },
  required: ["success", "results", "page", "limit", "totalResults"],
});

export const buildIdentifyUserOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
  },
  required: ["success"],
});

export const buildDeleteUserOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
  },
  required: ["success"],
});
