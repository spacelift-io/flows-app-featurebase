import { createWebhookSubscriptionBlock } from "../../utils/webhookHandlers.ts";
import { buildVoteEventPayload } from "../../schemas/common.ts";
import { postVotedEventSchema } from "../../utils/eventSchemas.ts";

export const postVotedSubscription = createWebhookSubscriptionBlock(
  "Post Voted",
  "Receives events when a post receives a vote (upvote/downvote) in Featurebase",
  "post.voted",
  "post.voted",
  buildVoteEventPayload,
  postVotedEventSchema,
);
