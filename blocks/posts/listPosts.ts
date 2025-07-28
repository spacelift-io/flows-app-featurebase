import { AppBlock, events } from "@slflows/sdk/v1";
import { listPosts } from "../../utils/apiHelpers.ts";
import { FeaturebaseListPostsParams } from "../../types.ts";
import { buildListPostsOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const listPostsBlock: AppBlock = {
  name: "List Posts",
  description:
    "Retrieves a paginated collection of posts from Featurebase with optional filtering and search. Use the 'Get Post' block to retrieve a single post by ID.",
  category: "Posts",
  inputs: {
    default: {
      config: {
        q: {
          name: "Search Query",
          description: "Search for posts by title or content",
          type: "string",
          required: false,
        },
        category: {
          name: "Categories",
          description: "Filter posts by category names",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        status: {
          name: "Statuses",
          description: "Filter posts by status IDs",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        sortBy: {
          name: "Sort By",
          description:
            "Sort posts by a specific attribute (e.g., 'date:desc', 'upvotes:desc')",
          type: "string",
          required: false,
        },
        startDate: {
          name: "Start Date",
          description: "Get posts created after this date (ISO format)",
          type: "string",
          required: false,
        },
        endDate: {
          name: "End Date",
          description: "Get posts created before this date (ISO format)",
          type: "string",
          required: false,
        },
        limit: {
          name: "Limit",
          description: "Number of results per page (default: 10)",
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
        const params: FeaturebaseListPostsParams = {
          q: input.event.inputConfig.q,
          category: input.event.inputConfig.category,
          status: input.event.inputConfig.status,
          sortBy: input.event.inputConfig.sortBy,
          startDate: input.event.inputConfig.startDate,
          endDate: input.event.inputConfig.endDate,
          limit: input.event.inputConfig.limit,
          page: input.event.inputConfig.page,
        };

        const response = await listPosts(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          posts: (response as any)?.results || [],
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
      description: "Posts retrieved successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildListPostsOutput() as any,
    },
  },
};
