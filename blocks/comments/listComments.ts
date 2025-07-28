import { AppBlock, events } from "@slflows/sdk/v1";
import { listComments } from "../../utils/apiHelpers.ts";
import { FeaturebaseListCommentsParams } from "../../types.ts";
import { buildListCommentsOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const listCommentsBlock: AppBlock = {
  name: "List Comments",
  description:
    "Retrieves a paginated list of comments from a post or changelog with optional filtering",
  category: "Comments",
  inputs: {
    default: {
      config: {
        submissionId: {
          name: "Post ID",
          description:
            "The ID of the post to get comments for (either ObjectId or slug)",
          type: "string",
          required: false,
        },
        changelogId: {
          name: "Changelog ID",
          description:
            "The ID of the changelog to get comments for (either ObjectId or slug)",
          type: "string",
          required: false,
        },
        privacy: {
          name: "Privacy Filter",
          description: "Filter comments by privacy setting",
          type: {
            type: "string",
            enum: ["public", "private", "all"],
          },
          required: false,
          default: "all",
        },
        inReview: {
          name: "In Review",
          description: "Filter comments by whether they are in review",
          type: "boolean",
          required: false,
        },
        commentThreadId: {
          name: "Comment Thread ID",
          description:
            "Get all comments in a thread with this comment as the root",
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
          description: "Page number for pagination (default: 1)",
          type: "number",
          required: false,
          default: 1,
        },
        sortBy: {
          name: "Sort By",
          description: "Sort order of the results",
          type: {
            type: "string",
            enum: ["best", "top", "new", "old"],
          },
          required: false,
          default: "best",
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseListCommentsParams = cleanParams({
          submissionId: input.event.inputConfig.submissionId,
          changelogId: input.event.inputConfig.changelogId,
          privacy: input.event.inputConfig.privacy,
          inReview: input.event.inputConfig.inReview,
          commentThreadId: input.event.inputConfig.commentThreadId,
          limit: input.event.inputConfig.limit,
          page: input.event.inputConfig.page,
          sortBy: input.event.inputConfig.sortBy,
        });

        const response = await listComments(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          comments: (response as any)?.results || [],
          pagination: {
            page: (response as any)?.page || 1,
            limit: (response as any)?.limit || 10,
            totalPages: (response as any)?.totalPages || 1,
            totalResults: (response as any)?.totalResults || 0,
          },
          filters: {
            submissionId: params.submissionId,
            changelogId: params.changelogId,
            privacy: params.privacy,
            inReview: params.inReview,
            commentThreadId: params.commentThreadId,
            sortBy: params.sortBy,
          },
          success: true,
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Comments retrieved successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildListCommentsOutput() as any,
    },
  },
};
