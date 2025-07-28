import { AppBlock, events } from "@slflows/sdk/v1";
import { unpublishChangelog } from "../../utils/apiHelpers.ts";
import { FeaturebaseUnpublishChangelogParams } from "../../types.ts";
import { buildUnpublishChangelogOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const unpublishChangelogBlock: AppBlock = {
  name: "Unpublish Changelog",
  description: "Unpublishes a changelog, making it no longer visible to users",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        id: {
          name: "Changelog ID",
          description: "The ID of the changelog to unpublish",
          type: "string",
          required: true,
        },
        locales: {
          name: "Locales",
          description:
            "Array of locales to unpublish the changelog from (empty array unpublishes from all locales)",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseUnpublishChangelogParams = cleanParams({
          id: input.event.inputConfig.id,
          locales: input.event.inputConfig.locales,
        });

        const response = await unpublishChangelog(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          changelogId: params.id,
          success: (response as any)?.success || true,
          unpublishedAt: new Date().toISOString(),
          locales: params.locales || [],
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog unpublished successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildUnpublishChangelogOutput() as any,
    },
  },
};
