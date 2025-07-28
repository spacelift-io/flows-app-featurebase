import { AppBlock, events } from "@slflows/sdk/v1";
import { createComment } from "../../utils/apiHelpers.ts";
import { FeaturebaseCreateCommentParams } from "../../types.ts";
import { buildCreateCommentOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const createCommentBlock: AppBlock = {
  name: "Create Comment",
  description:
    "Creates a new comment on a post or changelog with optional reply threading",
  category: "Comments",
  inputs: {
    default: {
      config: {
        submissionId: {
          name: "Post ID",
          description:
            "The ID of the post to comment on (either ObjectId or slug)",
          type: "string",
          required: false,
        },
        changelogId: {
          name: "Changelog ID",
          description:
            "The ID of the changelog to comment on (either ObjectId or slug)",
          type: "string",
          required: false,
        },
        content: {
          name: "Content",
          description: "The content of the comment",
          type: "string",
          required: true,
        },
        parentCommentId: {
          name: "Parent Comment ID",
          description: "The ID of the parent comment if this is a reply",
          type: "string",
          required: false,
        },
        isPrivate: {
          name: "Private Comment",
          description:
            "Whether this comment should be private (visible only to admins)",
          type: "boolean",
          required: false,
          default: false,
        },
        sendNotification: {
          name: "Send Notification",
          description:
            "Whether to notify voters of the submission about this comment",
          type: "boolean",
          required: false,
          default: true,
        },
        createdAt: {
          name: "Created At",
          description: "Custom creation date (useful for importing comments)",
          type: "string",
          required: false,
        },
        authorName: {
          name: "Author Name",
          description:
            "Custom author name (if not provided, uses API key owner)",
          type: "string",
          required: false,
        },
        authorEmail: {
          name: "Author Email",
          description:
            "Custom author email (if not provided, uses API key owner)",
          type: "string",
          required: false,
        },
        authorProfilePicture: {
          name: "Author Profile Picture",
          description: "Custom author profile picture URL",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseCreateCommentParams = {
          submissionId: input.event.inputConfig.submissionId,
          changelogId: input.event.inputConfig.changelogId,
          content: input.event.inputConfig.content,
          parentCommentId: input.event.inputConfig.parentCommentId,
          isPrivate: input.event.inputConfig.isPrivate,
          sendNotification: input.event.inputConfig.sendNotification,
          createdAt: input.event.inputConfig.createdAt,
        };

        // Add author information if provided
        if (
          input.event.inputConfig.authorName ||
          input.event.inputConfig.authorEmail
        ) {
          params.author = {
            name: input.event.inputConfig.authorName,
            email: input.event.inputConfig.authorEmail,
            profilePicture: input.event.inputConfig.authorProfilePicture,
          };
        }

        const response = await createComment(
          createApiConfig(input.app.config),
          cleanParams(params),
        );

        await events.emit({
          comment: (response as any)?.comment || response,
          success: (response as any)?.success || true,
          submissionId: params.submissionId,
          changelogId: params.changelogId,
          parentCommentId: params.parentCommentId,
          isReply: !!params.parentCommentId,
          createdAt: new Date().toISOString(),
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Comment created successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildCreateCommentOutput() as any,
    },
  },
};
