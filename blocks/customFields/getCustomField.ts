import { AppBlock, events } from "@slflows/sdk/v1";
import { getCustomField } from "../../utils/apiHelpers.ts";
import { buildGetCustomFieldOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getCustomFieldBlock: AppBlock = {
  name: "Get custom field by ID",
  description:
    "Retrieve details for a specific custom field by providing its unique identifier",
  category: "Custom Fields",

  inputs: {
    default: {
      name: "Get custom field by ID",
      description: "Retrieve details for a specific custom field",
      config: {
        id: {
          name: "Custom Field ID",
          description: "The unique identifier of the custom field to retrieve",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { id } = input.event.inputConfig;

        const result = await getCustomField(createApiConfig(input.app.config), {
          id,
        });

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Custom Field Details",
      description:
        "Emitted when custom field details are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildGetCustomFieldOutput() as any,
    },
  },
};
