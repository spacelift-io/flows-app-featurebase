import { AppBlock, events } from "@slflows/sdk/v1";
import { removeUsersFromRoles } from "../../utils/apiHelpers.ts";
import {
  emailsArraySchema,
  rolesArraySchema,
  buildRemoveUsersFromRolesOutput,
} from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const removeUsersFromRolesBlock: AppBlock = {
  name: "Remove users from roles",
  description: "Remove users from roles by email",
  category: "Roles",

  inputs: {
    default: {
      name: "Remove users from roles",
      description: "Remove specified roles from specified users",
      config: {
        emails: {
          name: "Emails",
          description: "An array of emails to remove roles from",
          type: emailsArraySchema,
          required: true,
        },
        roles: {
          name: "Roles",
          description:
            "An array of roles to remove from the users. If not provided, all roles will be removed",
          type: rolesArraySchema,
          required: false,
        },
      },
      onEvent: async (input) => {
        const { emails, roles } = input.event.inputConfig;

        const apiConfig = createApiConfig(input.app.config);

        const result = await removeUsersFromRoles(apiConfig, {
          emails,
          roles,
        });

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Success",
      description: "Emitted when users are successfully removed from roles",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildRemoveUsersFromRolesOutput() as any,
    },
  },
};
