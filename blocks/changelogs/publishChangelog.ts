import { AppBlock, events } from "@slflows/sdk/v1";
import { publishChangelog } from "../../utils/apiHelpers.ts";
import { FeaturebasePublishChangelogParams } from "../../types.ts";
import { buildPublishChangelogOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const publishChangelogBlock: AppBlock = {
  name: "Publish Changelog",
  description:
    "Publishes a changelog and optionally sends email notifications to subscribers",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        id: {
          name: "Changelog ID",
          description: "The ID of the changelog to publish",
          type: "string",
          required: true,
        },
        sendEmail: {
          name: "Send Email",
          description: "Whether to send email notifications to subscribers",
          type: "boolean",
          required: true,
          default: false,
        },
        locales: {
          name: "Locales",
          description:
            "Array of locales to publish the changelog to (empty array publishes to all locales)",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        scheduledDate: {
          name: "Scheduled Date",
          description:
            "The date when the changelog should be published (must be a future date, ISO format)",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebasePublishChangelogParams = cleanParams({
          id: input.event.inputConfig.id,
          sendEmail: input.event.inputConfig.sendEmail,
          locales: input.event.inputConfig.locales,
          scheduledDate: input.event.inputConfig.scheduledDate,
        });

        const response = await publishChangelog(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          changelogId: params.id,
          success: (response as any)?.success || true,
          publishedAt: new Date().toISOString(),
          emailSent: params.sendEmail,
          locales: params.locales || [],
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog published successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildPublishChangelogOutput() as any,
    },
  },
};
