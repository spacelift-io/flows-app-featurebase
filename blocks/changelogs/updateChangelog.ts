import { AppBlock, events } from "@slflows/sdk/v1";
import { updateChangelog } from "../../utils/apiHelpers.ts";
import { FeaturebaseUpdateChangelogParams } from "../../types.ts";
import { buildUpdateChangelogOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const updateChangelogBlock: AppBlock = {
  name: "Update Changelog",
  description:
    "Updates an existing changelog in Featurebase by providing the changelog ID and fields to update",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        id: {
          name: "Changelog ID",
          description: "The ID of the changelog to update",
          type: "string",
          required: true,
        },
        title: {
          name: "Title",
          description: "Updated title of the changelog",
          type: "string",
          required: false,
        },
        htmlContent: {
          name: "HTML Content",
          description: "Updated HTML content of the changelog",
          type: "string",
          required: false,
        },
        markdownContent: {
          name: "Markdown Content",
          description: "Updated markdown content of the changelog",
          type: "string",
          required: false,
        },
        changelogCategories: {
          name: "Categories",
          description: "Updated array of category identifiers",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        date: {
          name: "Date",
          description: "Updated date of the changelog (ISO format)",
          type: "string",
          required: false,
        },
        featuredImage: {
          name: "Featured Image URL",
          description: "Updated URL of the featured image",
          type: "string",
          required: false,
        },
        allowedSegmentIds: {
          name: "Allowed Segment IDs",
          description:
            "Updated array of segment IDs that are allowed to view the changelog",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseUpdateChangelogParams = cleanParams({
          id: input.event.inputConfig.id,
          title: input.event.inputConfig.title,
          htmlContent: input.event.inputConfig.htmlContent,
          markdownContent: input.event.inputConfig.markdownContent,
          changelogCategories: input.event.inputConfig.changelogCategories,
          date: input.event.inputConfig.date,
          featuredImage: input.event.inputConfig.featuredImage,
          allowedSegmentIds: input.event.inputConfig.allowedSegmentIds,
        });

        const response = await updateChangelog(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          changelogId: params.id,
          success: (response as any)?.success || true,
          updatedFields: Object.keys(params).filter(
            (key) =>
              params[key as keyof FeaturebaseUpdateChangelogParams] !==
                undefined && key !== "id",
          ),
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog updated successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildUpdateChangelogOutput() as any,
    },
  },
};
