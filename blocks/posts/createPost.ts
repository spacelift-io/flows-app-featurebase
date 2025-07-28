import { AppBlock, events } from "@slflows/sdk/v1";
import { createPost } from "../../utils/apiHelpers.ts";
import { FeaturebaseCreatePostParams } from "../../types.ts";
import { buildCreatePostOutput } from "../../schemas/common.ts";
import { cleanParams, createApiConfig } from "../../utils/objectUtils.ts";

export const createPostBlock: AppBlock = {
  name: "Create Post",
  description:
    "Creates a new post in Featurebase with specified title, category, and optional content",
  category: "Posts",
  inputs: {
    default: {
      config: {
        title: {
          name: "Title",
          description: "The title of the post (minimum 2 characters)",
          type: "string",
          required: true,
        },
        category: {
          name: "Category",
          description: "The board (category) for the post",
          type: "string",
          required: true,
        },
        content: {
          name: "Content",
          description: "The content of the post (can be empty)",
          type: "string",
          required: false,
        },
        email: {
          name: "Author Email",
          description:
            "Email of the user submitting the post. Creates a new user if email doesn't exist",
          type: "string",
          required: false,
        },
        authorName: {
          name: "Author Name",
          description:
            "Name for new user when email is provided. Used if email is not associated with existing user",
          type: "string",
          required: false,
        },
        tags: {
          name: "Tags",
          description: "Array of tag names to associate with the post",
          type: {
            type: "array",
            items: { type: "string" },
          },
          required: false,
        },
        commentsAllowed: {
          name: "Comments Allowed",
          description: "Whether comments are allowed on the post",
          type: "boolean",
          required: false,
          default: true,
        },
        status: {
          name: "Status",
          description: "The status of the post",
          type: "string",
          required: false,
        },
        date: {
          name: "Creation Date",
          description: "Custom creation date for the post (ISO format)",
          type: "string",
          required: false,
        },
        customInputValues: {
          name: "Custom Input Values",
          description:
            "Custom field values where key is field ID and value depends on field type",
          type: {
            type: "object",
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseCreatePostParams = cleanParams({
          title: input.event.inputConfig.title,
          category: input.event.inputConfig.category,
          content: input.event.inputConfig.content,
          email: input.event.inputConfig.email,
          authorName: input.event.inputConfig.authorName,
          tags: input.event.inputConfig.tags,
          commentsAllowed: input.event.inputConfig.commentsAllowed,
          status: input.event.inputConfig.status,
          date: input.event.inputConfig.date,
          customInputValues: input.event.inputConfig.customInputValues,
        });

        const response = await createPost(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          post: (response as any)?.submission,
          success: (response as any)?.success || true,
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Post created successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildCreatePostOutput() as any,
    },
  },
};
