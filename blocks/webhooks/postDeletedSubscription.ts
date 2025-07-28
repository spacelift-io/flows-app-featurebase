import { createWebhookSubscriptionBlock } from "../../utils/webhookHandlers.ts";
import { buildPostEventPayload } from "../../schemas/common.ts";
import { postDeletedEventSchema } from "../../utils/eventSchemas.ts";

export const postDeletedSubscription = createWebhookSubscriptionBlock(
  "Post Deleted",
  "Receives events when a post is deleted in Featurebase",
  "post.deleted",
  "post.deleted",
  buildPostEventPayload,
  postDeletedEventSchema,
);
