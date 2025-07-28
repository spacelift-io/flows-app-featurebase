import { AppBlock, events } from "@slflows/sdk/v1";
import { deleteComment } from "../../utils/apiHelpers.ts";
import { FeaturebaseDeleteCommentParams } from "../../types.ts";
import { buildDeleteCommentOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const deleteCommentBlock: AppBlock = {
  name: "Delete Comment",
  description:
    "Deletes a comment from Featurebase. Comments with replies are soft-deleted to maintain conversation context.",
  category: "Comments",
  inputs: {
    default: {
      config: {
        id: {
          name: "Comment ID",
          description: "The ID of the comment to delete",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const params: FeaturebaseDeleteCommentParams = {
          id: input.event.inputConfig.id,
        };

        const response = await deleteComment(
          createApiConfig(input.app.config),
          params,
        );

        await events.emit({
          commentId: params.id,
          success: (response as any)?.success || true,
          deletedAt: new Date().toISOString(),
          note: "Comments with replies are soft-deleted and marked as '[Deleted]' to maintain conversation context",
        });
      },
    },
  },
  outputs: {
    success: {
      name: "Success",
      description: "Comment deleted successfully",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildDeleteCommentOutput() as any,
    },
  },
};
