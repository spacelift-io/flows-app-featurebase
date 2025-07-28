import { AppBlock, events } from "@slflows/sdk/v1";
import { getBoard } from "../../utils/apiHelpers.ts";
import { buildGetBoardOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getBoardBlock: AppBlock = {
  name: "Get board by ID",
  description:
    "Retrieve details for a specific board by providing its unique identifier",
  category: "Boards",

  inputs: {
    default: {
      name: "Get board by ID",
      description: "Retrieve details for a specific board",
      config: {
        id: {
          name: "Board ID",
          description: "The unique identifier of the board to retrieve",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { id } = input.event.inputConfig;

        const result = await getBoard(createApiConfig(input.app.config), {
          id,
        });

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Board Details",
      description: "Emitted when board details are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildGetBoardOutput() as any,
    },
  },
};
