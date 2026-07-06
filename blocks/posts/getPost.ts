import { AppBlock, events } from "@slflows/sdk/v1";
import { FeaturebaseApiError, getPost } from "../../utils/apiHelpers.ts";
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
        let response: unknown;
        try {
          response = await getPost(createApiConfig(input.app.config), {
            id: input.event.inputConfig.id,
          });
        } catch (error) {
          // Nova returns 404 for a nonexistent post id; preserve the block's
          // historical "not found is not an error" contract.
          if (
            error instanceof FeaturebaseApiError &&
            error.statusCode === 404
          ) {
            await events.emit({ post: null, success: true, found: false });
            return;
          }
          throw error;
        }

        // Nova returns the Post object directly; the legacy API wrapped it
        // in `results` (array or single object). Support both.
        const raw = response as any;
        const post = Array.isArray(raw?.results)
          ? raw.results[0]
          : (raw?.results ?? raw);
        const found = !!(post && post.id);

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
