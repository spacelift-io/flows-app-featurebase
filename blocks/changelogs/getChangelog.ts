import { AppBlock, events } from "@slflows/sdk/v1";
import { FeaturebaseApiError, getChangelog } from "../../utils/apiHelpers.ts";
import { buildGetChangelogOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";
import { unwrapItem } from "../../utils/responseHelpers.ts";

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
        let response: unknown;
        try {
          response = await getChangelog(createApiConfig(input.app.config), {
            id: input.event.inputConfig.id,
          });
        } catch (error) {
          // Nova returns 404 for a nonexistent changelog id; preserve the
          // block's historical "not found is not an error" contract.
          if (
            error instanceof FeaturebaseApiError &&
            error.statusCode === 404
          ) {
            await events.emit({ changelog: null, success: true, found: false });
            return;
          }
          throw error;
        }

        // Nova returns the changelog object directly; the legacy API wrapped it
        // in `results` (array or single object). Support both.
        const changelog = unwrapItem(response);
        const found = !!(changelog && changelog.id);

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
