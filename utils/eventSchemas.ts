/**
 * JSON schemas for Featurebase webhook event outputs.
 * These schemas define the structure of events emitted by webhook subscription blocks.
 */

import {
  featurebaseWebhookEventBaseSchema,
  featurebasePostSchema,
  featurebaseCommentSchema,
  featurebaseChangelogSchema,
  featurebasePostVoteSchema,
  featurebaseChangeSchema,
} from "../jsonschema/jsonschema.ts";

/**
 * Creates a webhook event schema by combining base properties with specific payload
 */
function createWebhookEventSchema(
  payloadProperty: string,
  payloadSchema: any,
  additionalProperties?: any,
) {
  return {
    type: "object",
    description: `Featurebase webhook event payload`,
    properties: {
      ...featurebaseWebhookEventBaseSchema.properties,
      [payloadProperty]: payloadSchema,
      ...additionalProperties,
    },
    required: [...featurebaseWebhookEventBaseSchema.required, payloadProperty],
  } as const;
}

export const postCreatedEventSchema = createWebhookEventSchema("post", {
  ...featurebasePostSchema,
  description: "The post that was created",
});

export const postUpdatedEventSchema = createWebhookEventSchema(
  "post",
  {
    ...featurebasePostSchema,
    description: "The post that was updated",
  },
  {
    changes: {
      type: "array",
      items: featurebaseChangeSchema,
      description: "List of changes made to the post",
    },
  },
);

export const postDeletedEventSchema = createWebhookEventSchema("post", {
  ...featurebasePostSchema,
  description: "The post that was deleted",
});

export const postVotedEventSchema = createWebhookEventSchema("vote", {
  ...featurebasePostVoteSchema,
  description: "The vote action that was performed",
});

export const commentCreatedEventSchema = createWebhookEventSchema("comment", {
  ...featurebaseCommentSchema,
  description: "The comment that was created",
});

export const commentUpdatedEventSchema = createWebhookEventSchema(
  "comment",
  {
    ...featurebaseCommentSchema,
    description: "The comment that was updated",
  },
  {
    changes: {
      type: "array",
      items: featurebaseChangeSchema,
      description: "List of changes made to the comment",
    },
  },
);

export const commentDeletedEventSchema = createWebhookEventSchema("comment", {
  ...featurebaseCommentSchema,
  description: "The comment that was deleted",
});

export const changelogPublishedEventSchema = createWebhookEventSchema(
  "changelog",
  {
    ...featurebaseChangelogSchema,
    description: "The changelog entry that was published",
  },
);
