import { AppBlock, events } from "@slflows/sdk/v1";
import { listBoards } from "../../utils/apiHelpers.ts";
import { buildListBoardsOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const listBoardsBlock: AppBlock = {
  name: "List boards",
  description:
    "Retrieve a list of all boards (categories) in your Featurebase organization",
  category: "Boards",

  inputs: {
    default: {
      name: "List boards",
      description: "Retrieve all boards with their configuration",
      config: {},
      onEvent: async (input) => {
        const result = await listBoards(createApiConfig(input.app.config));

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Boards List",
      description: "Emitted when boards are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildListBoardsOutput() as any,
    },
  },
};
