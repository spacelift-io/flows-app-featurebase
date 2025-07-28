import { AppBlock, events } from "@slflows/sdk/v1";
import { getAdmin } from "../../utils/apiHelpers.ts";
import { buildGetAdminOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getAdminBlock: AppBlock = {
  name: "Get admin by ID",
  description:
    "Retrieve details for a specific admin by providing their unique identifier",
  category: "Admins",

  inputs: {
    default: {
      name: "Get admin by ID",
      description: "Retrieve details for a specific admin",
      config: {
        id: {
          name: "Admin ID",
          description: "The unique identifier of the admin to retrieve",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { id } = input.event.inputConfig;

        const result = await getAdmin(createApiConfig(input.app.config), {
          id,
        });

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Admin Details",
      description: "Emitted when admin details are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildGetAdminOutput() as any,
    },
  },
};
