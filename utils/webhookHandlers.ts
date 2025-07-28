import { AppBlock, events } from "@slflows/sdk/v1";
import { FeaturebaseWebhookEvent } from "../types.ts";

/**
 * Common webhook event base properties extracted from payload
 */
export interface WebhookEventBase {
  type: string;
  id: string;
  organizationId: string;
  webhookId: string;
  createdAt: string;
  deliveryStatus: string;
}

/**
 * Extracts common webhook payload from internal message
 */
export function extractWebhookPayload(message: any): FeaturebaseWebhookEvent {
  const { payload } = message.body as {
    headers: Record<string, string>;
    payload: FeaturebaseWebhookEvent;
  };
  return payload;
}

/**
 * Creates the base event properties from webhook payload
 */
export function createEventBase(
  payload: FeaturebaseWebhookEvent,
  eventType: string,
): WebhookEventBase {
  return {
    type: eventType,
    id: payload.id,
    organizationId: payload.organizationId,
    webhookId: payload.webhookId,
    createdAt: payload.createdAt,
    deliveryStatus: payload.deliveryStatus,
  };
}

/**
 * Creates a webhook handler function with common boilerplate
 */
export function createWebhookHandler<T>(
  expectedTopic: string,
  eventType: string,
  dataTransformer: (item: any, payload: FeaturebaseWebhookEvent) => T,
) {
  return async ({ message }: { message: any }) => {
    const payload = extractWebhookPayload(message);

    if (payload.topic !== expectedTopic) {
      return;
    }

    const eventBase = createEventBase(payload, eventType);
    const transformedData = dataTransformer(payload.data.item, payload);

    await events.emit({
      ...eventBase,
      ...transformedData,
    });
  };
}

/**
 * Creates a standard AppBlock for webhook subscription with common structure
 */
export function createWebhookSubscriptionBlock(
  name: string,
  description: string,
  expectedTopic: string,
  eventType: string,
  dataTransformer: (item: any, payload: FeaturebaseWebhookEvent) => any,
  eventSchema?: any,
): AppBlock {
  return {
    name,
    description,
    category: "Event Subscriptions",
    outputs: {
      event: {
        name: `${name} Event`,
        description: `Emitted when ${description.toLowerCase()}`,
        default: true,
        type: eventSchema || { type: "object" },
      },
    },
    onInternalMessage: createWebhookHandler(
      expectedTopic,
      eventType,
      dataTransformer,
    ),
  };
}
