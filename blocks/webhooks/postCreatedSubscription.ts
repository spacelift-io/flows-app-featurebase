import { createWebhookSubscriptionBlock } from "../../utils/webhookHandlers.ts";
import { buildPostEventPayload } from "../../schemas/common.ts";
import { postCreatedEventSchema } from "../../utils/eventSchemas.ts";

export const postCreatedSubscription = createWebhookSubscriptionBlock(
  "Post Created",
  "Receives events when a new post is created in Featurebase",
  "post.created",
  "post.created",
  buildPostEventPayload,
  postCreatedEventSchema,
);
