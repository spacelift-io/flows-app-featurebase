import { AppBlock, events } from "@slflows/sdk/v1";
import { addChangelogSubscribers } from "../../utils/apiHelpers.ts";
import { FeaturebaseAddChangelogSubscribersParams } from "../../types.ts";
import { buildAddChangelogSubscribersOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const addChangelogSubscribersBlock: AppBlock = {
  name: "Add Changelog Subscribers",
  description:
    "Adds new email addresses as changelog subscribers. They will receive emails when changelogs are published.",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        emails: {
          name: "Email Addresses",
          description: "Array of email addresses to add as subscribers",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: true,
        },
        locale: {
          name: "Locale",
          description: "The locale for the subscribers (default: 'en')",
          type: "string",
          required: false,
          default: "en",
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseAddChangelogSubscribersParams = cleanParams({
          emails: input.event.inputConfig.emails,
          locale: input.event.inputConfig.locale,
        });

        const response = await addChangelogSubscribers(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          success: (response as any)?.success || true,
          addedEmails: params.emails,
          addedCount: params.emails.length,
          locale: params.locale || "en",
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog subscribers added successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildAddChangelogSubscribersOutput() as any,
    },
  },
};
