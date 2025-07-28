import { AppBlock, events, EventInput } from "@slflows/sdk/v1";
import { listCustomFields } from "../../utils/apiHelpers.ts";
import { buildResolveCustomFieldsOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const resolveCustomFieldsBlock: AppBlock = {
  name: "Resolve custom fields",
  description:
    "Resolve custom field IDs and values to their human-readable form with field metadata",
  category: "Custom Fields",

  inputs: {
    default: {
      name: "Resolve custom fields",
      description: "Convert custom field IDs and values to readable format",
      config: {
        customInputValues: {
          name: "Custom input values",
          type: {
            type: "object",
            additionalProperties: true,
          },
          description:
            "Object containing custom field IDs as keys and their values",
          required: true,
        },
      },
      onEvent: async (input: EventInput) => {
        const { customInputValues } = input.event.inputConfig;

        // Get all custom fields to resolve against
        const customFieldsResult = (await listCustomFields(
          createApiConfig(input.app.config),
        )) as { success: boolean; results: any[]; error?: string };

        if (!customFieldsResult.success) {
          throw new Error("Failed to fetch custom fields");
        }

        const customFields = customFieldsResult.results;
        const resolvedFields = [];

        // Process each custom input value
        for (const [fieldId, value] of Object.entries(
          customInputValues || {},
        )) {
          // Skip empty values
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
          ) {
            continue;
          }

          const field = customFields.find((f: any) => f._id === fieldId);

          if (!field) {
            resolvedFields.push({
              label: "Unknown Field",
              value: value,
            });
            continue;
          }

          let resolvedValue = value;

          // Resolve option IDs to labels for choice fields
          if (field.options && field.options.length > 0) {
            const resolveOption = (optionId: string) => {
              const option = field.options.find(
                (opt: any) => opt._id === optionId,
              );
              return option ? option.label : optionId;
            };

            if (Array.isArray(value)) {
              resolvedValue = value.map(resolveOption);
            } else if (typeof value === "string") {
              resolvedValue = resolveOption(value);
            }
          }

          // If array has single element, unwrap it
          if (Array.isArray(resolvedValue) && resolvedValue.length === 1) {
            resolvedValue = resolvedValue[0];
          }

          resolvedFields.push({
            label: field.label,
            value: resolvedValue,
          });
        }

        await events.emit(resolvedFields);
      },
    },
  },

  outputs: {
    default: {
      name: "Resolved Custom Fields",
      description: "Emitted when custom fields are successfully resolved",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildResolveCustomFieldsOutput() as any,
    },
  },
};
