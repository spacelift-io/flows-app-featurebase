import { AppBlock, events } from "@slflows/sdk/v1";
import { getChangelog } from "../../utils/apiHelpers.ts";
import { buildGetChangelogOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getChangelogBlock: AppBlock = {
  name: "Get Changelog",
  description: "Retrieves a single changelog by ID from Featurebase",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        id: {
          name: "Changelog ID",
          description: "The ID of the changelog to retrieve",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const response = await getChangelog(createApiConfig(input.app.config), {
          id: input.event.inputConfig.id,
        });

        // Check if we got a changelog (FeatureBase returns array or single object)
        const changelog = Array.isArray((response as any)?.results)
          ? (response as any)?.results[0]
          : (response as any)?.results;
        const found = !!changelog;

        await events.emit({
          changelog: found ? changelog : null,
          success: true,
          found,
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog retrieved successfully (or not found)",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildGetChangelogOutput() as any,
    },
  },
};
