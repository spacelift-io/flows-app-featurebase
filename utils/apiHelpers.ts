import {
  FeaturebaseListPostsParams,
  FeaturebaseCreatePostParams,
  FeaturebaseUpdatePostParams,
  FeaturebaseDeletePostParams,
  FeaturebaseGetUpvotersParams,
  FeaturebaseAddUpvoterParams,
  FeaturebaseListCommentsParams,
  FeaturebaseCreateCommentParams,
  FeaturebaseUpdateCommentParams,
  FeaturebaseDeleteCommentParams,
  FeaturebaseListChangelogsParams,
  FeaturebaseCreateChangelogParams,
  FeaturebaseUpdateChangelogParams,
  FeaturebaseDeleteChangelogParams,
  FeaturebasePublishChangelogParams,
  FeaturebaseUnpublishChangelogParams,
  FeaturebaseAddChangelogSubscribersParams,
  FeaturebaseRemoveChangelogSubscribersParams,
  FeaturebaseAddUsersToRolesParams,
  FeaturebaseRemoveUsersFromRolesParams,
  FeaturebaseGetAdminParams,
  FeaturebaseGetBoardParams,
  FeaturebaseGetCustomFieldParams,
  FeaturebaseGetSurveyParams,
  FeaturebaseGetSurveyResponsesParams,
  FeaturebaseGetIdentifyUserParams,
  FeaturebaseQueryIdentifyUsersParams,
  FeaturebaseIdentifyUserParams,
  FeaturebaseDeleteUserParams,
} from "../types.ts";

export interface FeaturebaseApiConfig {
  apiKey: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://do.featurebase.app";

export class FeaturebaseApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any,
  ) {
    super(message);
    this.name = "FeaturebaseApiError";
  }
}

export async function makeFeaturebaseRequest(
  config: FeaturebaseApiConfig,
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    queryParams?: Record<string, any>;
    contentType?: "form" | "json";
  } = {},
) {
  const { method = "GET", body, queryParams, contentType = "form" } = options;
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;

  let url = `${baseUrl}${endpoint}`;

  if (queryParams) {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers: Record<string, string> = {
    "X-API-Key": config.apiKey,
  };

  let requestBody: string | undefined;
  if (body) {
    if (method === "GET") {
      // For GET requests with body, convert to form data in URL
      const formData = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      url += (url.includes("?") ? "&" : "?") + formData.toString();
    } else {
      if (contentType === "json") {
        requestBody = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
      } else {
        // For POST/PATCH/DELETE, use form-encoded body
        const formData = new URLSearchParams();
        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => formData.append(key, String(v)));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        requestBody = formData.toString();
        headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new FeaturebaseApiError(
        `Featurebase API error: ${response.status} ${response.statusText}`,
        response.status,
        responseData,
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof FeaturebaseApiError) {
      throw error;
    }
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function listPosts(
  config: FeaturebaseApiConfig,
  params: FeaturebaseListPostsParams = {},
) {
  return makeFeaturebaseRequest(config, "/v2/posts", {
    method: "GET",
    queryParams: params,
  });
}

export async function getPost(
  config: FeaturebaseApiConfig,
  params: { id: string },
) {
  return makeFeaturebaseRequest(config, "/v2/posts", {
    method: "GET",
    queryParams: { id: params.id },
  });
}

export async function createPost(
  config: FeaturebaseApiConfig,
  params: FeaturebaseCreatePostParams,
) {
  return makeFeaturebaseRequest(config, "/v2/posts", {
    method: "POST",
    body: params,
  });
}

export async function updatePost(
  config: FeaturebaseApiConfig,
  params: FeaturebaseUpdatePostParams,
) {
  return makeFeaturebaseRequest(config, "/v2/posts", {
    method: "PATCH",
    body: params,
  });
}

export async function deletePost(
  config: FeaturebaseApiConfig,
  params: FeaturebaseDeletePostParams,
) {
  return makeFeaturebaseRequest(config, "/v2/posts", {
    method: "DELETE",
    body: params,
  });
}

export async function getPostUpvoters(
  config: FeaturebaseApiConfig,
  params: FeaturebaseGetUpvotersParams,
) {
  return makeFeaturebaseRequest(config, "/v2/posts/upvoters", {
    method: "GET",
    queryParams: params,
  });
}

export async function addUpvoterToPost(
  config: FeaturebaseApiConfig,
  params: FeaturebaseAddUpvoterParams,
) {
  return makeFeaturebaseRequest(config, "/v2/posts/upvoters", {
    method: "POST",
    body: params,
  });
}

// Comment API functions
export async function listComments(
  config: FeaturebaseApiConfig,
  params: FeaturebaseListCommentsParams = {},
) {
  return makeFeaturebaseRequest(config, "/v2/comment", {
    method: "GET",
    queryParams: params,
  });
}

export async function createComment(
  config: FeaturebaseApiConfig,
  params: FeaturebaseCreateCommentParams,
) {
  return makeFeaturebaseRequest(config, "/v2/comment", {
    method: "POST",
    body: params,
  });
}

export async function updateComment(
  config: FeaturebaseApiConfig,
  params: FeaturebaseUpdateCommentParams,
) {
  return makeFeaturebaseRequest(config, "/v2/comment", {
    method: "PATCH",
    body: params,
  });
}

export async function deleteComment(
  config: FeaturebaseApiConfig,
  params: FeaturebaseDeleteCommentParams,
) {
  return makeFeaturebaseRequest(config, "/v2/comment", {
    method: "DELETE",
    body: params,
  });
}

// Changelog API functions
export async function listChangelogs(
  config: FeaturebaseApiConfig,
  params: FeaturebaseListChangelogsParams = {},
) {
  return makeFeaturebaseRequest(config, "/v2/changelog", {
    method: "GET",
    queryParams: params,
  });
}

export async function getChangelog(
  config: FeaturebaseApiConfig,
  params: { id: string },
) {
  return makeFeaturebaseRequest(config, "/v2/changelog", {
    method: "GET",
    queryParams: { id: params.id },
  });
}

export async function createChangelog(
  config: FeaturebaseApiConfig,
  params: FeaturebaseCreateChangelogParams,
) {
  return makeFeaturebaseRequest(config, "/v2/changelog", {
    method: "POST",
    body: params,
  });
}

export async function updateChangelog(
  config: FeaturebaseApiConfig,
  params: FeaturebaseUpdateChangelogParams,
) {
  return makeFeaturebaseRequest(config, "/v2/changelog", {
    method: "PATCH",
    body: params,
  });
}

export async function deleteChangelog(
  config: FeaturebaseApiConfig,
  params: FeaturebaseDeleteChangelogParams,
) {
  return makeFeaturebaseRequest(config, "/v2/changelog", {
    method: "DELETE",
    body: params,
  });
}

export async function publishChangelog(
  config: FeaturebaseApiConfig,
  params: FeaturebasePublishChangelogParams,
) {
  return makeFeaturebaseRequest(config, "/v2/changelog/publish", {
    method: "POST",
    body: params,
  });
}

export async function unpublishChangelog(
  config: FeaturebaseApiConfig,
  params: FeaturebaseUnpublishChangelogParams,
) {
  return makeFeaturebaseRequest(config, "/v2/changelog/unpublish", {
    method: "POST",
    body: params,
  });
}

export async function getChangelogSubscribers(config: FeaturebaseApiConfig) {
  return makeFeaturebaseRequest(config, "/v2/changelog/subscribers", {
    method: "GET",
  });
}

export async function addChangelogSubscribers(
  config: FeaturebaseApiConfig,
  params: FeaturebaseAddChangelogSubscribersParams,
) {
  return makeFeaturebaseRequest(config, "/v2/changelog/subscribers", {
    method: "POST",
    body: params,
  });
}

export async function removeChangelogSubscribers(
  config: FeaturebaseApiConfig,
  params: FeaturebaseRemoveChangelogSubscribersParams,
) {
  return makeFeaturebaseRequest(config, "/v2/changelog/subscribers", {
    method: "DELETE",
    body: params,
  });
}

// Roles API functions
export async function addUsersToRoles(
  config: FeaturebaseApiConfig,
  params: FeaturebaseAddUsersToRolesParams,
) {
  return makeFeaturebaseRequest(config, "/v2/organization/roles", {
    method: "POST",
    body: params,
  });
}

export async function removeUsersFromRoles(
  config: FeaturebaseApiConfig,
  params: FeaturebaseRemoveUsersFromRolesParams,
) {
  return makeFeaturebaseRequest(config, "/v2/organization/roles", {
    method: "DELETE",
    body: params,
  });
}

// Admin API functions
export async function listAdmins(config: FeaturebaseApiConfig) {
  return makeFeaturebaseRequest(config, "/v2/admins", {
    method: "GET",
  });
}

export async function getAdmin(
  config: FeaturebaseApiConfig,
  params: FeaturebaseGetAdminParams,
) {
  return makeFeaturebaseRequest(config, `/v2/admins/${params.id}`, {
    method: "GET",
  });
}

export async function listAdminRoles(config: FeaturebaseApiConfig) {
  return makeFeaturebaseRequest(config, "/v2/admins/roles", {
    method: "GET",
  });
}

// Board API functions
export async function listBoards(config: FeaturebaseApiConfig) {
  return makeFeaturebaseRequest(config, "/v2/boards", {
    method: "GET",
  });
}

export async function getBoard(
  config: FeaturebaseApiConfig,
  params: FeaturebaseGetBoardParams,
) {
  return makeFeaturebaseRequest(config, `/v2/boards/${params.id}`, {
    method: "GET",
  });
}

// Custom Field API functions
export async function listCustomFields(config: FeaturebaseApiConfig) {
  return makeFeaturebaseRequest(config, "/v2/custom_fields", {
    method: "GET",
  });
}

export async function getCustomField(
  config: FeaturebaseApiConfig,
  params: FeaturebaseGetCustomFieldParams,
) {
  return makeFeaturebaseRequest(config, `/v2/custom_fields/${params.id}`, {
    method: "GET",
  });
}

// Survey API functions
export async function listSurveys(config: FeaturebaseApiConfig) {
  return makeFeaturebaseRequest(config, "/v2/surveys", {
    method: "GET",
  });
}

export async function getSurvey(
  config: FeaturebaseApiConfig,
  params: FeaturebaseGetSurveyParams,
) {
  return makeFeaturebaseRequest(config, `/v2/surveys/${params.id}`, {
    method: "GET",
  });
}

export async function getSurveyResponses(
  config: FeaturebaseApiConfig,
  params: FeaturebaseGetSurveyResponsesParams,
) {
  return makeFeaturebaseRequest(config, `/v2/surveys/${params.id}/responses`, {
    method: "GET",
  });
}

// Identify Users API functions
export async function getIdentifyUser(
  config: FeaturebaseApiConfig,
  params: FeaturebaseGetIdentifyUserParams,
) {
  return makeFeaturebaseRequest(config, "/v2/organization/identifyUser", {
    method: "GET",
    queryParams: params,
  });
}

export async function queryIdentifyUsers(
  config: FeaturebaseApiConfig,
  params: FeaturebaseQueryIdentifyUsersParams = {},
) {
  return makeFeaturebaseRequest(config, "/v2/organization/identifyUser/query", {
    method: "GET",
    queryParams: params,
  });
}

export async function identifyUser(
  config: FeaturebaseApiConfig,
  params: FeaturebaseIdentifyUserParams,
) {
  return makeFeaturebaseRequest(config, "/v2/organization/identifyUser", {
    method: "POST",
    body: params,
    contentType: "json",
  });
}

export async function deleteUser(
  config: FeaturebaseApiConfig,
  params: FeaturebaseDeleteUserParams,
) {
  return makeFeaturebaseRequest(config, "/v2/organization/deleteUser", {
    method: "DELETE",
    body: params,
    contentType: "json",
  });
}
