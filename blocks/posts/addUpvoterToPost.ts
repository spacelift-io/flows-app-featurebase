import { AppBlock, events } from "@slflows/sdk/v1";
import { addUpvoterToPost } from "../../utils/apiHelpers.ts";
import { FeaturebaseAddUpvoterParams } from "../../types.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const addUpvoterToPostBlock: AppBlock = {
  name: "Add Upvoter to Post",
  description:
    "Adds an upvoter to a specific post by providing post ID, email, and name",
  category: "Posts",
  inputs: {
    default: {
      config: {
        id: {
          name: "Post ID",
          description: "The ID of the post to add an upvoter to",
          type: "string",
          required: true,
        },
        email: {
          name: "Email",
          description: "Email address of the upvoter",
          type: "string",
          required: true,
        },
        name: {
          name: "Name",
          description: "Name of the upvoter",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseAddUpvoterParams = {
          id: input.event.inputConfig.id,
          email: input.event.inputConfig.email,
          name: input.event.inputConfig.name,
        };

        const response = await addUpvoterToPost(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          postId: params.id,
          upvoter: {
            email: params.email,
            name: params.name,
          },
          success: (response as any)?.success || true,
          addedAt: new Date().toISOString(),
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Upvoter added successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          postId: {
            type: "string",
            description: "The ID of the post that received the upvoter",
          },
          upvoter: {
            type: "object",
            description: "Information about the added upvoter",
            properties: {
              email: {
                type: "string",
                description: "Email of the upvoter",
              },
              name: {
                type: "string",
                description: "Name of the upvoter",
              },
            },
            required: ["email", "name"],
          },
          success: {
            type: "boolean",
            description: "Whether the operation was successful",
          },
          addedAt: {
            type: "string",
            description: "Timestamp when the upvoter was added (ISO format)",
          },
        },
        required: ["postId", "upvoter", "success", "addedAt"],
      },
    },
  },
};
