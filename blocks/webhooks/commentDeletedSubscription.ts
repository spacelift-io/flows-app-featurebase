import { createWebhookSubscriptionBlock } from "../../utils/webhookHandlers.ts";
import { buildCommentEventPayload } from "../../schemas/common.ts";
import { commentDeletedEventSchema } from "../../utils/eventSchemas.ts";

export const commentDeletedSubscription = createWebhookSubscriptionBlock(
  "Comment Deleted",
  "Receives events when a comment is deleted in Featurebase",
  "comment.deleted",
  "comment.deleted",
  buildCommentEventPayload,
  commentDeletedEventSchema,
);
