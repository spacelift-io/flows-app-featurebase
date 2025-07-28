import { createWebhookSubscriptionBlock } from "../../utils/webhookHandlers.ts";
import { buildCommentUpdatedEventPayload } from "../../schemas/common.ts";
import { commentUpdatedEventSchema } from "../../utils/eventSchemas.ts";

export const commentUpdatedSubscription = createWebhookSubscriptionBlock(
  "Comment Updated",
  "Receives events when a comment is updated in Featurebase",
  "comment.updated",
  "comment.updated",
  buildCommentUpdatedEventPayload,
  commentUpdatedEventSchema,
);
