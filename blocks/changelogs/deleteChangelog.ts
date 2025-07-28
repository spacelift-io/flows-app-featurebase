import { AppBlock, events } from "@slflows/sdk/v1";
import { deleteChangelog } from "../../utils/apiHelpers.ts";
import { FeaturebaseDeleteChangelogParams } from "../../types.ts";
import { buildDeleteChangelogOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const deleteChangelogBlock: AppBlock = {
  name: "Delete Changelog",
  description:
    "Permanently deletes a changelog from Featurebase by providing the changelog ID",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        id: {
          name: "Changelog ID",
          description: "The ID of the changelog to delete",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseDeleteChangelogParams = {
          id: input.event.inputConfig.id,
        };

        const response = await deleteChangelog(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          changelogId: params.id,
          success: (response as any)?.success || true,
          deletedAt: new Date().toISOString(),
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog deleted successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildDeleteChangelogOutput() as any,
    },
  },
};
