import { createWebhookSubscriptionBlock } from "../../utils/webhookHandlers.ts";
import { buildChangelogEventPayload } from "../../schemas/common.ts";
import { changelogPublishedEventSchema } from "../../utils/eventSchemas.ts";

export const changelogPublishedSubscription = createWebhookSubscriptionBlock(
  "Changelog Published",
  "Receives events when a changelog entry is published in Featurebase",
  "changelog.published",
  "changelog.published",
  buildChangelogEventPayload,
  changelogPublishedEventSchema,
);
