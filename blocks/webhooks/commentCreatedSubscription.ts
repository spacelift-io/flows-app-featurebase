import { createWebhookSubscriptionBlock } from "../../utils/webhookHandlers.ts";
import { buildCommentEventPayload } from "../../schemas/common.ts";
import { commentCreatedEventSchema } from "../../utils/eventSchemas.ts";

export const commentCreatedSubscription = createWebhookSubscriptionBlock(
  "Comment Created",
  "Receives events when a new comment is created in Featurebase",
  "comment.created",
  "comment.created",
  buildCommentEventPayload,
  commentCreatedEventSchema,
);
