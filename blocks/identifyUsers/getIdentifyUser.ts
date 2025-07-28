import { AppBlock, events, EventInput } from "@slflows/sdk/v1";
import { getIdentifyUser } from "../../utils/apiHelpers.ts";
import { buildGetIdentifyUserOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getIdentifyUserBlock: AppBlock = {
  name: "Get identified user",
  description: "Retrieve an identified user's information by email or ID",
  category: "Identify Users",

  inputs: {
    default: {
      name: "Get identified user",
      description: "Retrieve details for a specific identified user",
      config: {
        email: {
          name: "Email",
          description: "Email of the user to retrieve",
          type: {
            type: "string",
            format: "email",
          },
          required: false,
        },
        id: {
          name: "User ID",
          description: "Your own ID of the user to retrieve",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input: EventInput) => {
        const { email, id } = input.event.inputConfig;

        // Validate that either email or id is provided
        if (!email && !id) {
          throw new Error("Either email or id must be provided");
        }

        const apiConfig = createApiConfig(input.app.config);

        const params: { email?: string; id?: string } = {};
        if (email) params.email = email;
        if (id) params.id = id;

        const result = await getIdentifyUser(apiConfig, params);

        await events.emit(result);
      },
    } as any,
  } as any,

  outputs: {
    default: {
      name: "User Details",
      description: "Emitted when user details are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildGetIdentifyUserOutput() as any,
    } as any,
  } as any,
};
