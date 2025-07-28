import { AppBlock, events } from "@slflows/sdk/v1";
import { addUsersToRoles } from "../../utils/apiHelpers.ts";
import {
  emailsArraySchema,
  rolesArraySchema,
  buildAddUsersToRolesOutput,
} from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const addUsersToRolesBlock: AppBlock = {
  name: "Add users to roles",
  description: "Add users to roles to control access to boards and changelogs",
  category: "Roles",

  inputs: {
    default: {
      name: "Add users to roles",
      description: "Add specified users to specified roles",
      config: {
        emails: {
          name: "Emails",
          description: "An array of emails to add to the role",
          type: emailsArraySchema,
          required: true,
        },
        roles: {
          name: "Roles",
          description: "The roles to give these users",
          type: rolesArraySchema,
          required: true,
        },
      },
      onEvent: async (input) => {
        const { emails, roles } = input.event.inputConfig;

        const apiConfig = createApiConfig(input.app.config);

        const result = await addUsersToRoles(apiConfig, {
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
      description: "Emitted when users are successfully added to roles",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildAddUsersToRolesOutput() as any,
    },
  },
};
