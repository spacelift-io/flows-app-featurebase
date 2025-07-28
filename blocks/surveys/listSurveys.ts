import { AppBlock, events } from "@slflows/sdk/v1";
import { listSurveys } from "../../utils/apiHelpers.ts";
import { buildListSurveysOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const listSurveysBlock: AppBlock = {
  name: "List surveys",
  description:
    "Retrieve a list of all surveys configured in your Featurebase organization",
  category: "Surveys",

  inputs: {
    default: {
      name: "List surveys",
      description: "Retrieve all surveys with their configuration",
      config: {},
      onEvent: async (input) => {
        const apiConfig = createApiConfig(input.app.config);

        const result = await listSurveys(apiConfig);

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Surveys List",
      description: "Emitted when surveys are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildListSurveysOutput() as any,
    },
  },
};
