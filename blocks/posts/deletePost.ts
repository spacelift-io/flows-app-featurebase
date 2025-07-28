import { AppBlock, events } from "@slflows/sdk/v1";
import { deletePost } from "../../utils/apiHelpers.ts";
import { FeaturebaseDeletePostParams } from "../../types.ts";
import { buildDeletePostOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const deletePostBlock: AppBlock = {
  name: "Delete Post",
  description:
    "Permanently deletes a post from Featurebase by providing the post ID",
  category: "Posts",
  inputs: {
    default: {
      config: {
        id: {
          name: "Post ID",
          description: "The ID of the post to delete",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseDeletePostParams = {
          id: input.event.inputConfig.id,
        };

        const response = await deletePost(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          postId: params.id,
          success: (response as any)?.success || true,
          deletedAt: new Date().toISOString(),
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Post deleted successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildDeletePostOutput() as any,
    },
  },
};
