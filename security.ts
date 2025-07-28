import { createHmac, timingSafeEqual } from "node:crypto";

export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
}

export function verifyFeaturebaseWebhook(
  signature: string,
  timestamp: string,
  rawBody: string,
  secret: string,
): WebhookVerificationResult {
  try {
    if (!signature || !timestamp || !secret) {
      return {
        isValid: false,
        error: "Missing signature, timestamp, or secret",
      };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp, 10);
    const maxTimestampDiff = 5 * 60; // 5 minutes

    if (Math.abs(currentTime - webhookTime) > maxTimestampDiff) {
      return {
        isValid: false,
        error: "Webhook timestamp too old or too far in the future",
      };
    }

    const signedPayload = `${timestamp}.${rawBody}`;
    const expectedSignature = createHmac("sha256", secret)
      .update(signedPayload, "utf8")
      .digest("hex");

    const isValid = timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );

    return {
      isValid,
      error: isValid ? undefined : "Invalid signature",
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Verification failed: ${(error as Error).message}`,
    };
  }
}
