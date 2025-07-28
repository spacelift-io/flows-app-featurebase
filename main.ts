import { blocks, defineApp, messaging, http } from "@slflows/sdk/v1";
import { FeaturebaseTopicType, FeaturebaseWebhookEvent } from "./types.ts";
import { verifyFeaturebaseWebhook } from "./security.ts";

// Import event generator blocks
import { postCreatedSubscription } from "./blocks/webhooks/postCreatedSubscription.ts";
import { postUpdatedSubscription } from "./blocks/webhooks/postUpdatedSubscription.ts";
import { postDeletedSubscription } from "./blocks/webhooks/postDeletedSubscription.ts";
import { postVotedSubscription } from "./blocks/webhooks/postVotedSubscription.ts";
import { changelogPublishedSubscription } from "./blocks/webhooks/changelogPublishedSubscription.ts";
import { commentCreatedSubscription } from "./blocks/webhooks/commentCreatedSubscription.ts";
import { commentUpdatedSubscription } from "./blocks/webhooks/commentUpdatedSubscription.ts";
import { commentDeletedSubscription } from "./blocks/webhooks/commentDeletedSubscription.ts";

// Import action blocks
import {
  listPostsBlock,
  getPostBlock,
  createPostBlock,
  updatePostBlock,
  deletePostBlock,
  getPostUpvotersBlock,
  addUpvoterToPostBlock,
} from "./blocks/posts/index.ts";
import {
  listCommentsBlock,
  createCommentBlock,
  updateCommentBlock,
  deleteCommentBlock,
} from "./blocks/comments/index.ts";
import {
  listChangelogsBlock,
  getChangelogBlock,
  createChangelogBlock,
  updateChangelogBlock,
  deleteChangelogBlock,
  publishChangelogBlock,
  unpublishChangelogBlock,
  getChangelogSubscribersBlock,
  addChangelogSubscribersBlock,
  removeChangelogSubscribersBlock,
} from "./blocks/changelogs/index.ts";
import {
  addUsersToRolesBlock,
  removeUsersFromRolesBlock,
} from "./blocks/roles/index.ts";
import {
  listAdminsBlock,
  getAdminBlock,
  listAdminRolesBlock,
} from "./blocks/admins/index.ts";
import { listBoardsBlock, getBoardBlock } from "./blocks/boards/index.ts";
import {
  listCustomFieldsBlock,
  getCustomFieldBlock,
  resolveCustomFieldsBlock,
} from "./blocks/customFields/index.ts";
import {
  listSurveysBlock,
  getSurveyBlock,
  getSurveyResponsesBlock,
} from "./blocks/surveys/index.ts";
import {
  getIdentifyUserBlock,
  queryIdentifyUsersBlock,
  identifyUserBlock,
  deleteUserBlock,
} from "./blocks/identifyUsers/index.ts";

interface EventConfig {
  blockTypeId: string;
  validate: (payload: unknown) => boolean;
}

const createWebhookValidator = (
  expectedTopic: FeaturebaseTopicType,
  expectedItemType: string,
) => {
  return (payload: unknown): payload is FeaturebaseWebhookEvent => {
    if (
      !payload ||
      typeof payload !== "object" ||
      !("topic" in payload) ||
      (payload as any).topic !== expectedTopic ||
      !("data" in payload) ||
      typeof (payload as any).data !== "object" ||
      (payload as any).data === null ||
      !("item" in (payload as any).data) ||
      typeof (payload as any).data.item !== "object" ||
      (payload as any).data.item === null ||
      !("type" in (payload as any).data.item) ||
      (payload as any).data.item.type !== expectedItemType
    ) {
      return false;
    }
    return true;
  };
};

const EVENT_CONFIG: Record<FeaturebaseTopicType, EventConfig> = {
  "post.created": {
    blockTypeId: "postCreatedSubscription",
    validate: createWebhookValidator("post.created", "post"),
  },
  "post.updated": {
    blockTypeId: "postUpdatedSubscription",
    validate: createWebhookValidator("post.updated", "post"),
  },
  "post.deleted": {
    blockTypeId: "postDeletedSubscription",
    validate: createWebhookValidator("post.deleted", "post"),
  },
  "post.voted": {
    blockTypeId: "postVotedSubscription",
    validate: createWebhookValidator("post.voted", "post_vote"),
  },
  "changelog.published": {
    blockTypeId: "changelogPublishedSubscription",
    validate: createWebhookValidator("changelog.published", "changelog"),
  },
  "comment.created": {
    blockTypeId: "commentCreatedSubscription",
    validate: createWebhookValidator("comment.created", "comment"),
  },
  "comment.updated": {
    blockTypeId: "commentUpdatedSubscription",
    validate: createWebhookValidator("comment.updated", "comment"),
  },
  "comment.deleted": {
    blockTypeId: "commentDeletedSubscription",
    validate: createWebhookValidator("comment.deleted", "comment"),
  },
};

export const app = defineApp({
  name: "Featurebase",
  installationInstructions:
    "To connect your Featurebase account:\n1. **Get Webhook Secret**: In your Featurebase dashboard, go to Settings > Webhooks and copy your signing secret\n2. **Configure**: Paste your webhook secret in the field below\n3. **Add API Key**: Get your API key from Featurebase dashboard settings\n4. **Confirm**: Complete the installation to start using Featurebase blocks",

  blocks: {
    // Webhook subscription blocks
    postCreatedSubscription,
    postUpdatedSubscription,
    postDeletedSubscription,
    postVotedSubscription,
    changelogPublishedSubscription,
    commentCreatedSubscription,
    commentUpdatedSubscription,
    commentDeletedSubscription,

    // Post action blocks
    listPosts: listPostsBlock,
    getPost: getPostBlock,
    createPost: createPostBlock,
    updatePost: updatePostBlock,
    deletePost: deletePostBlock,
    getPostUpvoters: getPostUpvotersBlock,
    addUpvoterToPost: addUpvoterToPostBlock,

    // Comment action blocks
    listComments: listCommentsBlock,
    createComment: createCommentBlock,
    updateComment: updateCommentBlock,
    deleteComment: deleteCommentBlock,

    // Changelog action blocks
    listChangelogs: listChangelogsBlock,
    getChangelog: getChangelogBlock,
    createChangelog: createChangelogBlock,
    updateChangelog: updateChangelogBlock,
    deleteChangelog: deleteChangelogBlock,
    publishChangelog: publishChangelogBlock,
    unpublishChangelog: unpublishChangelogBlock,
    getChangelogSubscribers: getChangelogSubscribersBlock,
    addChangelogSubscribers: addChangelogSubscribersBlock,
    removeChangelogSubscribers: removeChangelogSubscribersBlock,

    // Roles action blocks
    addUsersToRoles: addUsersToRolesBlock,
    removeUsersFromRoles: removeUsersFromRolesBlock,

    // Admin action blocks
    listAdmins: listAdminsBlock,
    getAdmin: getAdminBlock,
    listAdminRoles: listAdminRolesBlock,

    // Board action blocks
    listBoards: listBoardsBlock,
    getBoard: getBoardBlock,

    // Custom Field action blocks
    listCustomFields: listCustomFieldsBlock,
    getCustomField: getCustomFieldBlock,
    resolveCustomFields: resolveCustomFieldsBlock,

    // Survey action blocks
    listSurveys: listSurveysBlock,
    getSurvey: getSurveyBlock,
    getSurveyResponses: getSurveyResponsesBlock,

    // Identify Users action blocks
    getIdentifyUser: getIdentifyUserBlock,
    queryIdentifyUsers: queryIdentifyUsersBlock,
    identifyUser: identifyUserBlock,
    deleteUser: deleteUserBlock,
  },
  config: {
    webhookSecret: {
      name: "Webhook Secret",
      description:
        "The signing secret from your Featurebase webhook configuration (starts with 'whsec_')",
      type: "string",
      required: true,
      sensitive: true,
    },
    apiKey: {
      name: "API Key",
      description: "Your Featurebase API key for making API requests",
      type: "string",
      required: true,
      sensitive: true,
    },
    baseUrl: {
      name: "Base URL",
      description:
        "Featurebase API base URL (default: https://do.featurebase.app)",
      type: "string",
      required: false,
      default: "https://do.featurebase.app",
    },
  },
  http: {
    onRequest: async ({ request, app }) => {
      if (request.path !== "/") {
        await http.respond(request.requestId, {
          statusCode: 404,
          headers: {},
          body: { error: "Not found" },
        });
        return;
      }

      if (request.method !== "POST") {
        await http.respond(request.requestId, {
          statusCode: 405,
          headers: {},
          body: { error: "Method not allowed" },
        });
        return;
      }

      try {
        const signature = request.headers["X-Webhook-Signature"];
        const timestamp = request.headers["X-Webhook-Timestamp"];

        if (!signature || !timestamp) {
          await http.respond(request.requestId, {
            statusCode: 400,
            headers: {},
            body: {
              error:
                "Missing required webhook headers (X-Webhook-Signature, X-Webhook-Timestamp)",
            },
          });
          return;
        }

        const webhookSecret = app.config.webhookSecret;
        if (!webhookSecret) {
          await http.respond(request.requestId, {
            statusCode: 400,
            headers: {},
            body: {
              error: "Webhook secret not configured",
            },
          });
          return;
        }

        const verification = verifyFeaturebaseWebhook(
          signature,
          timestamp,
          request.rawBody,
          webhookSecret,
        );

        if (!verification.isValid) {
          await http.respond(request.requestId, {
            statusCode: 401,
            headers: {},
            body: {
              error: `Webhook verification failed: ${verification.error}`,
            },
          });
          return;
        }

        const payload = request.body as FeaturebaseWebhookEvent;
        const topic = payload.topic;

        if (!(topic in EVENT_CONFIG)) {
          await http.respond(request.requestId, {
            statusCode: 200,
            headers: {},
            body: {
              message: "Event type not supported",
              topic,
            },
          });
          return;
        }

        const config = EVENT_CONFIG[topic];

        if (!config.validate(payload)) {
          await http.respond(request.requestId, {
            statusCode: 400,
            headers: {},
            body: {
              error: `Invalid ${topic} event payload`,
            },
          });
          return;
        }

        const listOutput = await blocks.list({
          typeIds: [config.blockTypeId],
        });

        if (listOutput.blocks.length === 0) {
          await http.respond(request.requestId, {
            statusCode: 200,
            headers: {},
            body: {
              message: "No subscription blocks found",
              topic,
            },
          });
          return;
        }

        await messaging.sendToBlocks({
          body: {
            headers: request.headers,
            payload: payload,
          },
          blockIds: listOutput.blocks.map((block) => block.id),
        });

        await http.respond(request.requestId, {
          statusCode: 200,
          headers: {},
          body: {
            message: "ok",
            topic,
            blocksNotified: listOutput.blocks.length,
          },
        });
      } catch (error) {
        await http.respond(request.requestId, {
          statusCode: 500,
          headers: {},
          body: {
            error: `Internal server error: ${(error as Error).message}`,
          },
        });
      }
    },
  },
});
