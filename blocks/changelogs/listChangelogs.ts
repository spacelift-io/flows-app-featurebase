import { AppBlock, events } from "@slflows/sdk/v1";
import { listChangelogs } from "../../utils/apiHelpers.ts";
import { FeaturebaseListChangelogsParams } from "../../types.ts";
import { buildListChangelogsOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const listChangelogsBlock: AppBlock = {
  name: "List Changelogs",
  description:
    "Retrieves a paginated collection of changelogs from Featurebase with optional filtering and search. Use the 'Get Changelog' block to retrieve a single changelog by ID.",
  category: "Changelogs",
  inputs: {
    default: {
      config: {
        q: {
          name: "Search Query",
          description: "Search for changelogs by title or content",
          type: "string",
          required: false,
        },
        categories: {
          name: "Categories",
          description: "Filter changelogs by category names",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        state: {
          name: "State",
          description: "Filter by changelog state",
          type: {
            type: "string",
            enum: ["draft", "live"],
          },
          required: false,
        },
        locale: {
          name: "Locale",
          description: "Filter by locale (default: 'en')",
          type: "string",
          required: false,
          default: "en",
        },
        limit: {
          name: "Limit",
          description: "Number of results per page (default: 10, max: 100)",
          type: "number",
          required: false,
          default: 10,
        },
        page: {
          name: "Page",
          description: "Page number (default: 1)",
          type: "number",
          required: false,
          default: 1,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseListChangelogsParams = {
          q: input.event.inputConfig.q,
          categories: input.event.inputConfig.categories,
          state: input.event.inputConfig.state,
          locale: input.event.inputConfig.locale,
          limit: input.event.inputConfig.limit,
          page: input.event.inputConfig.page,
        };

        const response = await listChangelogs(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          changelogs: (response as any)?.results || [],
          pagination: {
            page: (response as any)?.page || 1,
            limit: (response as any)?.limit || 10,
            totalPages: (response as any)?.totalPages || 1,
            totalResults: (response as any)?.totalResults || 0,
          },
          success: true,
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Changelogs retrieved successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildListChangelogsOutput() as any,
    },
  },
};
