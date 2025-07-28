import { AppBlock, events } from "@slflows/sdk/v1";
import { listAdmins } from "../../utils/apiHelpers.ts";
import { buildListAdminsOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const listAdminsBlock: AppBlock = {
  name: "List admins",
  description:
    "Retrieve a list of all admins for your Featurebase organization",
  category: "Admins",

  inputs: {
    default: {
      name: "List admins",
      description: "Retrieve all admin users",
      config: {},
      onEvent: async (input) => {
        const result = await listAdmins(createApiConfig(input.app.config));

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Admins List",
      description: "Emitted when admins are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildListAdminsOutput() as any,
    },
  },
};
