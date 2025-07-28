import { AppBlock, events } from "@slflows/sdk/v1";
import { getSurvey } from "../../utils/apiHelpers.ts";
import { buildGetSurveyOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getSurveyBlock: AppBlock = {
  name: "Get survey by ID",
  description:
    "Retrieve details for a specific survey by providing its unique identifier",
  category: "Surveys",

  inputs: {
    default: {
      name: "Get survey by ID",
      description: "Retrieve details for a specific survey",
      config: {
        id: {
          name: "Survey ID",
          description: "The unique identifier of the survey to retrieve",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { id } = input.event.inputConfig;

        const apiConfig = createApiConfig(input.app.config);

        const result = await getSurvey(apiConfig, { id });

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Survey Details",
      description: "Emitted when survey details are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildGetSurveyOutput() as any,
    },
  },
};
