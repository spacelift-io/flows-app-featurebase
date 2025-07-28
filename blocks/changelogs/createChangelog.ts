import { AppBlock, events } from "@slflows/sdk/v1";
import { createChangelog } from "../../utils/apiHelpers.ts";
import { FeaturebaseCreateChangelogParams } from "../../types.ts";
import { buildCreateChangelogOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const createChangelogBlock: AppBlock = {
  name: "Create Changelog",
  description: "Creates a new changelog in Featurebase with title and content",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        title: {
          name: "Title",
          description: "The title of the changelog",
          type: "string",
          required: true,
        },
        htmlContent: {
          name: "HTML Content",
          description:
            "The HTML content of the changelog. Provide either htmlContent or markdownContent.",
          type: "string",
          required: false,
        },
        markdownContent: {
          name: "Markdown Content",
          description:
            "The markdown content of the changelog. Provide either htmlContent or markdownContent.",
          type: "string",
          required: false,
        },
        changelogCategories: {
          name: "Categories",
          description:
            "Array of category identifiers (e.g., ['New', 'Fixed', 'Improved'])",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        featuredImage: {
          name: "Featured Image URL",
          description: "URL of the featured image for the changelog",
          type: "string",
          required: false,
        },
        allowedSegmentIds: {
          name: "Allowed Segment IDs",
          description:
            "Array of segment IDs that are allowed to view the changelog",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        locale: {
          name: "Locale",
          description: "The locale of the changelog (default: 'en')",
          type: "string",
          required: false,
          default: "en",
        },
        date: {
          name: "Date",
          description: "The date of the changelog (ISO format)",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseCreateChangelogParams = cleanParams({
          title: input.event.inputConfig.title,
          htmlContent: input.event.inputConfig.htmlContent,
          markdownContent: input.event.inputConfig.markdownContent,
          changelogCategories: input.event.inputConfig.changelogCategories,
          featuredImage: input.event.inputConfig.featuredImage,
          allowedSegmentIds: input.event.inputConfig.allowedSegmentIds,
          locale: input.event.inputConfig.locale,
          date: input.event.inputConfig.date,
        });

        const response = await createChangelog(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          changelog: (response as any)?.results || (response as any)?.changelog,
          success: (response as any)?.success || true,
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelog created successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildCreateChangelogOutput() as any,
    },
  },
};
