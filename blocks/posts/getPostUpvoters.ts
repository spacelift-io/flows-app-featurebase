import { AppBlock, events } from "@slflows/sdk/v1";
import { getPostUpvoters } from "../../utils/apiHelpers.ts";
import { FeaturebaseGetUpvotersParams } from "../../types.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getPostUpvotersBlock: AppBlock = {
  name: "Get Post Upvoters",
  description:
    "Retrieves a paginated list of users who have upvoted a specific post",
  category: "Posts",
  inputs: {
    default: {
      config: {
        submissionId: {
          name: "Post ID",
          description: "The ID of the post to get upvoters for",
          type: "string",
          required: true,
        },
        page: {
          name: "Page",
          description: "Page number for pagination (default: 1)",
          type: "number",
          required: false,
          default: 1,
        },
        limit: {
          name: "Limit",
          description: "Number of results per page (default: 10, max: 100)",
          type: "number",
          required: false,
          default: 10,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseGetUpvotersParams = {
          submissionId: input.event.inputConfig.submissionId,
          page: input.event.inputConfig.page,
          limit: input.event.inputConfig.limit,
        };

        const response = await getPostUpvoters(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          postId: params.submissionId,
          upvoters: (response as any)?.results || [],
          pagination: {
            page: (response as any)?.page || 1,
            limit: (response as any)?.limit || 10,
            totalPages: (response as any)?.totalPages || 1,
            totalResults: (response as any)?.totalResults || 0,
          },
          success: (response as any)?.success || true,
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Upvoters retrieved successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          postId: {
            type: "string",
            description: "The ID of the post",
          },
          upvoters: {
            type: "array",
            description: "Array of users who upvoted the post",
            items: {
              type: "object",
              properties: {
                id: { type: "string", description: "Upvoter ID" },
                userId: { type: "string", description: "User ID" },
                organizationId: {
                  type: "string",
                  description: "Organization ID",
                },
                companies: {
                  type: "array",
                  description: "Companies associated with the user",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "Company ID" },
                      name: { type: "string", description: "Company name" },
                      monthlySpend: {
                        type: "number",
                        description: "Monthly spend amount",
                      },
                      createdAt: {
                        type: "string",
                        description: "Company creation date",
                      },
                      customFields: {
                        type: "object",
                        description: "Custom fields for the company",
                        additionalProperties: true,
                      },
                      _id: {
                        type: "string",
                        description: "Internal company ID",
                      },
                    },
                    required: ["id", "name", "monthlySpend", "createdAt"],
                  },
                },
                email: { type: "string", description: "User email" },
                name: { type: "string", description: "User name" },
                profilePicture: {
                  type: "string",
                  description: "User profile picture URL",
                },
                commentsCreated: {
                  type: "number",
                  description: "Number of comments created",
                },
                postsCreated: {
                  type: "number",
                  description: "Number of posts created",
                },
                lastActivity: {
                  type: "string",
                  description: "Last activity timestamp",
                },
                subscribedToChangelog: {
                  type: "boolean",
                  description: "Whether subscribed to changelog",
                },
                manuallyOptedOutFromChangelog: {
                  type: "boolean",
                  description: "Whether manually opted out from changelog",
                },
                roles: {
                  type: "array",
                  description: "User roles",
                  items: { type: "string" },
                },
                locale: { type: "string", description: "User locale" },
                verified: {
                  type: "boolean",
                  description: "Whether user is verified",
                },
                type: { type: "string", description: "User type" },
                description: {
                  type: "string",
                  description: "User description",
                },
              },
              required: ["id", "userId", "email", "name", "verified", "type"],
            },
          },
          pagination: {
            type: "object",
            description: "Pagination information",
            properties: {
              page: { type: "number", description: "Current page number" },
              limit: { type: "number", description: "Items per page" },
              totalPages: {
                type: "number",
                description: "Total number of pages",
              },
              totalResults: {
                type: "number",
                description: "Total number of upvoters",
              },
            },
            required: ["page", "limit", "totalPages", "totalResults"],
          },
          success: {
            type: "boolean",
            description: "Whether the operation was successful",
          },
        },
        required: ["postId", "upvoters", "pagination", "success"],
      },
    },
  },
};
