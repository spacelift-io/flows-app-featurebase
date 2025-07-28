import { AppBlock, events } from "@slflows/sdk/v1";
import { getChangelogSubscribers } from "../../utils/apiHelpers.ts";
import { buildGetChangelogSubscribersOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getChangelogSubscribersBlock: AppBlock = {
  name: "Get Changelog Subscribers",
  description: "Retrieves a list of all changelog subscribers",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        // No configuration needed for this endpoint
      },
      onEvent: async (input) => {
        const response = await getChangelogSubscribers(
          createApiConfig(input.app.config),
        );

        const emails = (response as any)?.emails || [];

        await events.emit({
          emails,
          success: (response as any)?.success || true,
          totalSubscribers: emails.length,
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog subscribers retrieved successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildGetChangelogSubscribersOutput() as any,
    },
  },
};
