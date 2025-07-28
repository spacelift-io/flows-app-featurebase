import { AppBlock, events } from "@slflows/sdk/v1";
import { getSurveyResponses } from "../../utils/apiHelpers.ts";
import { buildGetSurveyResponsesOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const getSurveyResponsesBlock: AppBlock = {
  name: "Get survey responses",
  description:
    "Retrieve all user responses for a specific survey by providing its unique identifier",
  category: "Surveys",

  inputs: {
    default: {
      name: "Get survey responses",
      description: "Retrieve all responses for a specific survey",
      config: {
        id: {
          name: "Survey ID",
          description:
            "The unique identifier of the survey to retrieve responses for",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { id } = input.event.inputConfig;

        const apiConfig = createApiConfig(input.app.config);

        const result = await getSurveyResponses(apiConfig, { id });

        await events.emit(result);
      },
    },
  },

  outputs: {
    default: {
      name: "Survey Responses",
      description: "Emitted when survey responses are successfully retrieved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildGetSurveyResponsesOutput() as any,
    },
  },
};
