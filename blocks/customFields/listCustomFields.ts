import { AppBlock, events } from "@slflows/sdk/v1";
import { listCustomFields } from "../../utils/apiHelpers.ts";
import { buildListCustomFieldsOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const listCustomFieldsBlock: AppBlock = {
  name: "List custom fields",
  description:
    "Retrieve a list of all custom fields configured in your Featurebase organization",
  category: "Custom Fields",

  inputs: {
    default: {
      name: "List custom fields",
      description: "Retrieve all custom fields with their configuration",
      config: {},
      onEvent: async (input) => {
        const result = await listCustomFields(
          createApiConfig(input.app.config),
        );

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Custom Fields List",
      description: "Emitted when custom fields are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildListCustomFieldsOutput() as any,
    },
  },
};
