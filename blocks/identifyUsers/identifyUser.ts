import { AppBlock, events, EventInput } from "@slflows/sdk/v1";
import { identifyUser } from "../../utils/apiHelpers.ts";
import { buildIdentifyUserOutput } from "../../schemas/common.ts";
import { createApiConfig } from "../../utils/objectUtils.ts";

export const identifyUserBlock: AppBlock = {
  name: "Identify user",
  description:
    "Add or update user data in Featurebase with customer information, companies, and custom fields",
  category: "Identify Users",

  inputs: {
    default: {
      name: "Identify user",
      description: "Identify or update user information in Featurebase",
      config: {
        email: {
          name: "Email",
          description: "Email of the user to be identified",
          type: {
            type: "string",
            format: "email",
          },
          required: false,
        },
        userId: {
          name: "User ID",
          description: "Your own ID of the user to be identified",
          type: {
            type: "string",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the user to be identified",
          type: {
            type: "string",
          },
          required: true,
        },
        profilePicture: {
          name: "Profile Picture",
          description: "URL of the user's profile picture",
          type: {
            type: "string",
            format: "uri",
          },
          required: false,
        },
        subscribedToChangelog: {
          name: "Subscribed to Changelog",
          description:
            "Whether the user is subscribed to receive changelog emails",
          type: {
            type: "boolean",
          },
          required: false,
        },
        companies: {
          name: "Companies",
          description: "Array of companies this user is associated with",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "Company ID",
                },
                name: {
                  type: "string",
                  description: "Company name",
                },
                monthlySpend: {
                  type: "number",
                  description: "Monthly recurring revenue from this company",
                },
                createdAt: {
                  type: "string",
                  description: "Date when the company was created",
                },
                customFields: {
                  type: "object",
                  description: "Company custom fields",
                  additionalProperties: true,
                },
              },
              required: ["id", "name", "monthlySpend"],
            },
          },
          required: false,
        },
        customFields: {
          name: "Custom Fields",
          description:
            "Object containing key-value pairs of user custom fields",
          type: {
            type: "object",
            additionalProperties: true,
          },
          required: false,
        },
        createdAt: {
          name: "Created At",
          description: "Date when the user was created",
          type: {
            type: "string",
            format: "date-time",
          },
          required: false,
        },
        roles: {
          name: "Roles",
          description: "Array of role names to assign to this user",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        locale: {
          name: "Locale",
          description:
            "User's preferred language code (e.g., 'en' for English)",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input: EventInput) => {
        const {
          email,
          userId,
          name,
          profilePicture,
          subscribedToChangelog,
          companies,
          customFields,
          createdAt,
          roles,
          locale,
        } = input.event.inputConfig;

        // Validate that either email or userId is provided
        if (!email && !userId) {
          throw new Error("Either email or userId must be provided");
        }

        const apiConfig = createApiConfig(input.app.config);

        const params: {
          email?: string;
          userId?: string;
          name: string;
          profilePicture?: string;
          subscribedToChangelog?: boolean;
          companies?: any[];
          customFields?: Record<string, any>;
          createdAt?: string;
          roles?: string[];
          locale?: string;
        } = {
          name,
        };

        if (email) params.email = email;
        if (userId) params.userId = userId;
        if (profilePicture) params.profilePicture = profilePicture;
        if (subscribedToChangelog !== undefined)
          params.subscribedToChangelog = subscribedToChangelog;
        if (companies) params.companies = companies;
        if (customFields) params.customFields = customFields;
        if (createdAt) params.createdAt = createdAt;
        if (roles) params.roles = roles;
        if (locale) params.locale = locale;

        const result = await identifyUser(apiConfig, params);

        await events.emit(result);
      },
    } as any,
  } as any,

  outputs: {
    default: {
      name: "User Identified",
      description: "Emitted when user is successfully identified/updated",
      default: true,
      possiblePrimaryParents: ["default"],
      type: buildIdentifyUserOutput() as any,
    } as any,
  } as any,
};
