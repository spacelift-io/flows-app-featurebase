import { AppBlock, events } from "@slflows/sdk/v1";
import { updateComment } from "../../utils/apiHelpers.ts";
import { FeaturebaseUpdateCommentParams } from "../../types.ts";
import { buildUpdateCommentOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const updateCommentBlock: AppBlock = {
  name: "Update Comment",
  description:
    "Updates an existing comment's content, privacy, pinning, or review status",
  category: "Comments",
  inputs: {
    default: {
      config: {
        id: {
          name: "Comment ID",
          description: "The ID of the comment to update",
          type: "string",
          required: true,
        },
        content: {
          name: "Content",
          description: "Updated content for the comment",
          type: "string",
          required: false,
        },
        isPrivate: {
          name: "Private Comment",
          description:
            "Whether the comment should be private (visible only to admins)",
          type: "boolean",
          required: false,
        },
        pinned: {
          name: "Pinned",
          description:
            "Whether the comment should be pinned (displayed at top)",
          type: "boolean",
          required: false,
        },
        inReview: {
          name: "In Review",
          description: "Whether the comment should be marked as under review",
          type: "boolean",
          required: false,
        },
        createdAt: {
          name: "Created At",
          description:
            "Update the creation date (useful for importing comments)",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseUpdateCommentParams = cleanParams({
          id: input.event.inputConfig.id,
          content: input.event.inputConfig.content,
          isPrivate: input.event.inputConfig.isPrivate,
          pinned: input.event.inputConfig.pinned,
          inReview: input.event.inputConfig.inReview,
          createdAt: input.event.inputConfig.createdAt,
        });

        const response = await updateComment(
          createApiConfig(input.app.config),
          params,
        );

        // Track which fields were updated
        const updatedFields: string[] = [];
        if (params.content !== undefined) updatedFields.push("content");
        if (params.isPrivate !== undefined) updatedFields.push("isPrivate");
        if (params.pinned !== undefined) updatedFields.push("pinned");
        if (params.inReview !== undefined) updatedFields.push("inReview");
        if (params.createdAt !== undefined) updatedFields.push("createdAt");

        await events.emit({
          commentId: params.id,
          updatedFields,
          updates: {
            content: params.content,
            isPrivate: params.isPrivate,
            pinned: params.pinned,
            inReview: params.inReview,
            createdAt: params.createdAt,
          },
          success: (response as any)?.success || true,
          updatedAt: new Date().toISOString(),
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Comment updated successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildUpdateCommentOutput() as any,
    },
  },
};
