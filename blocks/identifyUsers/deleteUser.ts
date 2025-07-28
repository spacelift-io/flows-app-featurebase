import { AppBlock, events, EventInput } from "@slflows/sdk/v1";
import { deleteUser } from "../../utils/apiHelpers.ts";
import { buildDeleteUserOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const deleteUserBlock: AppBlock = {
  name: "Delete user",
  description:
    "Delete a user from your Featurebase organization, removing all associated data",
  category: "Identify Users",

  inputs: {
    default: {
      name: "Delete user",
      description: "Delete user and all associated data from Featurebase",
      config: {
        email: {
          name: "Email",
          description: "Email of the user to delete",
          type: {
            type: "string",
            format: "email",
          },
          required: false,
        },
        userId: {
          name: "User ID",
          description: "Your own ID of the user to delete",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input: EventInput) => {
        const { email, userId } = input.event.inputConfig;

        // Validate that either email or userId is provided
        if (!email && !userId) {
          throw new Error("Either email or userId must be provided");
        }

        const apiConfig = createApiConfig(input.app.config);

        const params: { email?: string; userId?: string } = {};
        if (email) params.email = email;
        if (userId) params.userId = userId;

        const result = await deleteUser(apiConfig, params);

        await events.emit(result);
      },
    } as any,
  } as any,

  outputs: {
    default: {
      name: "User Deleted",
      description: "Emitted when user is successfully deleted",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildDeleteUserOutput() as any,
    } as any,
  } as any,
};
