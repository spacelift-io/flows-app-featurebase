import { AppBlock, events } from "@slflows/sdk/v1";
import { removeChangelogSubscribers } from "../../utils/apiHelpers.ts";
import { FeaturebaseRemoveChangelogSubscribersParams } from "../../types.ts";
import { buildRemoveChangelogSubscribersOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const removeChangelogSubscribersBlock: AppBlock = {
  name: "Remove Changelog Subscribers",
  description:
    "Removes email addresses from changelog subscribers. They will no longer receive changelog emails.",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        emails: {
          name: "Email Addresses",
          description: "Array of email addresses to remove from subscribers",
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
        const params: FeaturebaseRemoveChangelogSubscribersParams = cleanParams(
          {
            emails: input.event.inputConfig.emails,
            locale: input.event.inputConfig.locale,
          },
        );

        const response = await removeChangelogSubscribers(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          success: (response as any)?.success || true,
          removedEmails: params.emails,
          removedCount: params.emails.length,
          locale: params.locale || "en",
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog subscribers removed successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildRemoveChangelogSubscribersOutput() as any,
    },
  },
};
