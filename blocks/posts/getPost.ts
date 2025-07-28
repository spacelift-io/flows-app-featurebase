import { AppBlock, events } from "@slflows/sdk/v1";
import { getPost } from "../../utils/apiHelpers.ts";
import { buildGetPostOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getPostBlock: AppBlock = {
  name: "Get Post",
  description: "Retrieves a single post by ID from Featurebase",
  category: "Posts",
  inputs: {
    default: {
      config: {
        id: {
          name: "Post ID",
          description: "The ID of the post to retrieve",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const response = await getPost(createApiConfig(input.app.config), {
          id: input.event.inputConfig.id,
        });

        // Check if we got a post (FeatureBase returns array or single object)
        const post = Array.isArray((response as any)?.results)
          ? (response as any)?.results[0]
          : (response as any)?.results;
        const found = !!post;

        await events.emit({
          post: found ? post : null,
          success: true,
          found,
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      possiblePrimaryParents: ["default"],
      description: "Post retrieved successfully (or not found)",
      default: true,
      type: buildGetPostOutput() as any,
    },
  },
};
