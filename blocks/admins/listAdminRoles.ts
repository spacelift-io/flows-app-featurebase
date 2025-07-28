import { AppBlock, events } from "@slflows/sdk/v1";
import { listAdminRoles } from "../../utils/apiHelpers.ts";
import { buildListAdminRolesOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const listAdminRolesBlock: AppBlock = {
  name: "List admin roles",
  description:
    "Retrieve a list of all available admin roles and their associated permissions",
  category: "Admins",

  inputs: {
    default: {
      name: "List admin roles",
      description: "Retrieve all admin roles with permissions",
      config: {},
      onEvent: async (input) => {
        const result = await listAdminRoles(createApiConfig(input.app.config));

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Admin Roles List",
      description: "Emitted when admin roles are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildListAdminRolesOutput() as any,
    },
  },
};
