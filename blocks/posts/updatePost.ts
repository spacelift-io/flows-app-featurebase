import { AppBlock, events } from "@slflows/sdk/v1";
import { updatePost } from "../../utils/apiHelpers.ts";
import { FeaturebaseUpdatePostParams } from "../../types.ts";
import { buildUpdatePostOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const updatePostBlock: AppBlock = {
  name: "Update Post",
  description:
    "Updates an existing post in Featurebase by providing the post ID and fields to update",
  category: "Posts",
  inputs: {
    default: {
      config: {
        id: {
          name: "Post ID",
          description: "The ID of the post to update",
          type: "string",
          required: true,
        },
        title: {
          name: "Title",
          description: "Updated title of the post",
          type: "string",
          required: false,
        },
        content: {
          name: "Content",
          description: "Updated HTML content of the post",
          type: "string",
          required: false,
        },
        status: {
          name: "Status",
          description: "Updated status of the post",
          type: "string",
          required: false,
        },
        commentsAllowed: {
          name: "Comments Allowed",
          description: "Whether comments are allowed on the post",
          type: "boolean",
          required: false,
        },
        category: {
          name: "Category",
          description: "Updated category of the post",
          type: "string",
          required: false,
        },
        sendStatusUpdateEmail: {
          name: "Send Status Update Email",
          description: "Whether to send status update email to upvoters",
          type: "boolean",
          required: false,
          default: false,
        },
        tags: {
          name: "Tags",
          description: "Updated tags for the post",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        inReview: {
          name: "In Review",
          description:
            "Whether the post is in review (hidden from users when true)",
          type: "boolean",
          required: false,
        },
        date: {
          name: "Creation Date",
          description: "Updated creation date of the post (ISO format)",
          type: "string",
          required: false,
        },
        customInputValues: {
          name: "Custom Input Values",
          description:
            "Updated custom field values where key is field ID and value depends on field type",
          type: {
            type: "object",
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseUpdatePostParams = {
          id: input.event.inputConfig.id,
          title: input.event.inputConfig.title,
          content: input.event.inputConfig.content,
          status: input.event.inputConfig.status,
          commentsAllowed: input.event.inputConfig.commentsAllowed,
          category: input.event.inputConfig.category,
          sendStatusUpdateEmail: input.event.inputConfig.sendStatusUpdateEmail,
          tags: input.event.inputConfig.tags,
          inReview: input.event.inputConfig.inReview,
          date: input.event.inputConfig.date,
          customInputValues: input.event.inputConfig.customInputValues,
        };

        const response = await updatePost(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          postId: params.id,
          success: (response as any)?.success || true,
          updatedFields: Object.keys(params).filter(
            (key) =>
              params[key as keyof FeaturebaseUpdatePostParams] !== undefined &&
              key !== "id",
          ),
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Post updated successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildUpdatePostOutput() as any,
    },
  },
};
