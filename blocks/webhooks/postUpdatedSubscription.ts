import { createWebhookSubscriptionBlock } from "../../utils/webhookHandlers.ts";
import { buildPostUpdatedEventPayload } from "../../schemas/common.ts";
import { postUpdatedEventSchema } from "../../utils/eventSchemas.ts";

export const postUpdatedSubscription = createWebhookSubscriptionBlock(
  "Post Updated",
  "Receives events when a post is updated in Featurebase",
  "post.updated",
  "post.updated",
  buildPostUpdatedEventPayload,
  postUpdatedEventSchema,
);
