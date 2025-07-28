import { AppBlock, events, EventInput } from "@slflows/sdk/v1";
import { queryIdentifyUsers } from "../../utils/apiHelpers.ts";
import { buildQueryIdentifyUsersOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const queryIdentifyUsersBlock: AppBlock = {
  name: "Query identified users",
  description:
    "Paginate through all identified users in your organization with filtering and sorting options",
  category: "Identify Users",

  inputs: {
    default: {
      name: "Query identified users",
      description: "Retrieve paginated list of identified users with filters",
      config: {
        page: {
          name: "Page",
          description: "Page number to fetch (Default: 1)",
          type: {
            type: "string",
          },
          required: false,
          default: "1",
        },
        limit: {
          name: "Limit",
          description: "Number of users to fetch per page (Default: 10)",
          type: {
            type: "string",
          },
          required: false,
          default: "10",
        },
        sortBy: {
          name: "Sort By",
          description: "Field to sort by",
          type: {
            type: "string",
            enum: ["topPosters", "topCommenters", "lastActivity"],
          },
          required: false,
          default: "lastActivity",
        },
        q: {
          name: "Search Query",
          description: "Query string to search for users by name or email",
          type: {
            type: "string",
          },
          required: false,
        },
        segment: {
          name: "Segment",
          description: "Segment to filter users by (e.g., 'Paid Users')",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input: EventInput) => {
        const { page, limit, sortBy, q, segment } = input.event.inputConfig;

        const apiConfig = createApiConfig(input.app.config);

        const params: {
          page?: string;
          limit?: string;
          sortBy?: string;
          q?: string;
          segment?: string;
        } = {};

        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (sortBy) params.sortBy = sortBy;
        if (q) params.q = q;
        if (segment) params.segment = segment;

        const result = await queryIdentifyUsers(apiConfig, params as any);

        await events.emit(result);
      },
    } as any,
  } as any,

  outputs: {
    default: {
      name: "Users List",
      description: "Emitted when users list is successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildQueryIdentifyUsersOutput() as any,
    } as any,
  } as any,
};
