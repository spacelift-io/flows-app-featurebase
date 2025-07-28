export type FeaturebaseTopicType =
  | "post.created"
  | "post.updated"
  | "post.deleted"
  | "post.voted"
  | "changelog.published"
  | "comment.created"
  | "comment.updated"
  | "comment.deleted";

export interface FeaturebaseUser {
  id: string;
  email: string;
  name: string;
  profilePicture: string;
  verified: boolean;
  type: string;
  description: string;
}

export interface FeaturebasePostStatus {
  name: string;
  color: string;
  type: string;
  isDefault: boolean;
  id: string;
}

export interface FeaturebasePostCategory {
  category: string;
  private: boolean;
  segmentIds: string[];
  roles: string[];
  customInputFields: unknown[];
  icon: {
    type: string;
    value: string;
  };
  id: string;
}

export interface FeaturebasePost {
  id: string;
  type: "post";
  title: string;
  content: string;
  user: FeaturebaseUser;
  postStatus: FeaturebasePostStatus;
  postCategory: FeaturebasePostCategory;
  date: string;
  slug: string;
  upvotes: number;
  inReview: boolean;
  accessUsers: string[];
  accessCompanies: string[];
  clickupTasks: unknown[];
  githubIssues: unknown[];
  commentsAllowed: boolean;
  categoryId: string;
  lastModified: string;
  lastUpvoted: string;
  commentCount: number;
  postTags: unknown[];
  pinned: boolean;
  devopsWorkItems: unknown[];
}

export interface FeaturebasePostVote {
  type: "post_vote";
  action: "add" | "remove";
  submissionId: string;
  user: FeaturebaseUser;
}

export interface FeaturebaseComment {
  type: "comment";
  id: string;
  content: string;
  user: FeaturebaseUser;
  isPrivate: boolean;
  score: number;
  upvotes: number;
  downvotes: number;
  inReview: boolean;
  pinned: boolean;
  emailSent: boolean;
  sendNotification: boolean;
  createdAt: string;
  updatedAt: string;
  organization: string;
  submission: string;
  path: string;
}

export interface FeaturebaseChangelogCategory {
  name: string;
  color: string;
  segmentIds: string[];
  roles: string[];
  id: string;
}

export interface FeaturebaseChangelog {
  id: string;
  type: "changelog";
  title: string;
  content: string;
  markdownContent: string;
  featuredImage: string;
  date: string;
  state: string;
  locale: string;
  slug: string;
  firstPublishInLocale: boolean;
  changelogCategories: FeaturebaseChangelogCategory[];
  commentCount: number;
  notifications: Record<
    string,
    {
      sendEmailNotification: boolean;
      hideFromBoardAndWidgets: boolean;
      scheduledDate: string | null;
    }
  >;
  allowedSegmentIds: string[];
  isDraftDiffersFromLive: boolean;
  isPublished: boolean;
  availableLocales: string[];
  publishedLocales: string[];
  slugs: Record<string, string>;
  organization: string;
}

export interface FeaturebaseChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface FeaturebaseEventData {
  type: "notification_event_data";
  item:
    | FeaturebasePost
    | FeaturebasePostVote
    | FeaturebaseComment
    | FeaturebaseChangelog;
  changes?: FeaturebaseChange[];
}

export interface FeaturebaseWebhookEvent {
  type: "notification_event";
  topic: FeaturebaseTopicType;
  organizationId: string;
  data: FeaturebaseEventData;
  id: string;
  webhookId: string;
  createdAt: string;
  deliveryStatus: "pending" | "success" | "failure";
  firstSentAt?: string;
  deliveryAttempts?: number;
}

export interface FeaturebasePostTag {
  name: string;
  color?: string;
  private: boolean;
  id: string;
}

export interface FeaturebaseListPostsParams {
  q?: string;
  category?: string[];
  status?: string[];
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface FeaturebaseCreatePostParams {
  title: string;
  category: string;
  content?: string;
  email?: string;
  authorName?: string;
  tags?: string[];
  commentsAllowed?: boolean;
  status?: string;
  date?: string;
  customInputValues?: Record<string, any>;
}

export interface FeaturebaseUpdatePostParams {
  id: string;
  title?: string;
  content?: string;
  status?: string;
  commentsAllowed?: boolean;
  category?: string;
  sendStatusUpdateEmail?: boolean;
  tags?: string[];
  inReview?: boolean;
  date?: string;
  customInputValues?: Record<string, any>;
}

export interface FeaturebaseDeletePostParams {
  id: string;
}

export interface FeaturebasePostUpvoter {
  id: string;
  userId: string;
  organizationId: string;
  companies: Array<{
    id: string;
    name: string;
    monthlySpend: number;
    createdAt: string;
    customFields: Record<string, any>;
    _id: string;
  }>;
  email: string;
  name: string;
  profilePicture: string;
  commentsCreated: number;
  postsCreated: number;
  lastActivity: string;
  subscribedToChangelog: boolean;
  manuallyOptedOutFromChangelog: boolean;
  roles: string[];
  locale: string;
  verified: boolean;
  type: string;
  description: string;
}

export interface FeaturebaseGetUpvotersParams {
  submissionId: string;
  page?: number;
  limit?: number;
}

export interface FeaturebaseAddUpvoterParams {
  id: string;
  email: string;
  name: string;
}

// Comment-related interfaces for action blocks
export interface FeaturebaseCommentDetailed {
  id: string;
  content: string;
  author: string;
  authorId: string;
  authorPicture: string;
  isPrivate: boolean;
  isDeleted: boolean;
  upvotes: number;
  downvotes: number;
  score: number;
  submission?: string;
  changelog?: string;
  parentComment?: string;
  path: string;
  replies: FeaturebaseCommentDetailed[];
  organization: string;
  createdAt: string;
  updatedAt?: string;
  originalSubmission?: string;
  postStatus?: string;
  inReview: boolean;
  pinned: boolean;
  confidenceScore?: number;
  upvoted?: boolean;
  downvoted?: boolean;
  isSpam?: boolean;
  emailSent?: boolean;
  sendNotification?: boolean;
}

export interface FeaturebaseListCommentsParams {
  submissionId?: string;
  changelogId?: string;
  privacy?: "public" | "private" | "all";
  inReview?: boolean;
  commentThreadId?: string;
  limit?: number;
  page?: number;
  sortBy?: "best" | "top" | "new" | "old";
}

export interface FeaturebaseCreateCommentParams {
  submissionId?: string;
  changelogId?: string;
  content: string;
  parentCommentId?: string;
  isPrivate?: boolean;
  sendNotification?: boolean;
  createdAt?: string;
  author?: {
    name: string;
    email: string;
    profilePicture?: string;
  };
}

export interface FeaturebaseUpdateCommentParams {
  id: string;
  content?: string;
  isPrivate?: boolean;
  pinned?: boolean;
  inReview?: boolean;
  createdAt?: string;
}

export interface FeaturebaseDeleteCommentParams {
  id: string;
}

// Changelog-related interfaces for action blocks
export interface FeaturebaseChangelogCategoryDetailed {
  name: string;
  color: string;
  segmentIds: string[];
  roles: string[];
  id: string;
}

export interface FeaturebaseChangelogDetailed {
  id: string;
  slug: string;
  featuredImage: string;
  title: string;
  content: string;
  markdownContent: string;
  date: string;
  state: "draft" | "live";
  changelogCategories: FeaturebaseChangelogCategoryDetailed[];
  organization: string;
  emailSentToSubscribers: boolean;
  commentCount: number;
  allowedSegmentIds: string[];
  locale: string;
  sendNotification?: boolean;
}

export interface FeaturebaseListChangelogsParams {
  id?: string;
  q?: string;
  categories?: string[];
  limit?: number;
  page?: number;
  locale?: string;
  state?: "draft" | "live";
}

export interface FeaturebaseCreateChangelogParams {
  title: string;
  htmlContent?: string;
  markdownContent?: string;
  changelogCategories?: string[];
  featuredImage?: string;
  allowedSegmentIds?: string[];
  locale?: string;
  date?: string;
}

export interface FeaturebaseUpdateChangelogParams {
  id: string;
  title?: string;
  htmlContent?: string;
  markdownContent?: string;
  changelogCategories?: string[];
  date?: string;
  featuredImage?: string;
  allowedSegmentIds?: string[];
}

export interface FeaturebaseDeleteChangelogParams {
  id: string;
}

export interface FeaturebasePublishChangelogParams {
  id: string;
  sendEmail: boolean;
  locales?: string[];
  scheduledDate?: string;
}

export interface FeaturebaseUnpublishChangelogParams {
  id: string;
  locales?: string[];
}

export interface FeaturebaseGetChangelogSubscribersParams {
  // No parameters needed
}

export interface FeaturebaseAddChangelogSubscribersParams {
  emails: string[];
  locale?: string;
}

export interface FeaturebaseRemoveChangelogSubscribersParams {
  emails: string[];
  locale?: string;
}

// Roles-related interfaces for action blocks
export interface FeaturebaseAddUsersToRolesParams {
  emails: string[];
  roles: string[];
}

export interface FeaturebaseRemoveUsersFromRolesParams {
  emails: string[];
  roles?: string[];
}

// Admin-related interfaces for action blocks
export interface FeaturebaseAdmin {
  id: string;
  name: string;
  email: string;
  picture: string;
  roleId: string;
}

export interface FeaturebaseAdminRolePermissions {
  view_comments_private: boolean;
  manage_comments: boolean;
  manage_comments_private: boolean;
  set_comment_pinned: boolean;
  moderate_comments: boolean;
  set_post_category: boolean;
  set_post_pinned: boolean;
  set_post_eta: boolean;
  set_post_tags: boolean;
  set_post_author: boolean;
  set_post_status: boolean;
  set_post_assignee: boolean;
  set_post_custom_fields: boolean;
  post_vote_on_behalf: boolean;
  post_merge: boolean;
  post_import: boolean;
  post_export: boolean;
  moderate_posts: boolean;
  view_users: boolean;
  manage_users: boolean;
  view_posts_private: boolean;
  view_private_post_tags: boolean;
  manage_changelogs: boolean;
  manage_surveys: boolean;
  manage_branding: boolean;
  manage_billing: boolean;
  manage_team_members: boolean;
  manage_sso: boolean;
  manage_api: boolean;
  manage_statuses: boolean;
  manage_boards: boolean;
  manage_post_tags: boolean;
  manage_custom_fields: boolean;
  manage_moderation_settings: boolean;
  manage_roadmap: boolean;
  manage_user_roles: boolean;
  manage_prioritization: boolean;
  manage_notifications: boolean;
  manage_custom_domain: boolean;
  manage_integrations: boolean;
  use_integrations: boolean;
  manage_help_center: boolean;
  auto_approve_posts: boolean;
}

export interface FeaturebaseAdminRole {
  name: string;
  permissions: FeaturebaseAdminRolePermissions;
  _id: string;
}

export interface FeaturebaseGetAdminParams {
  id: string;
}

// Board-related interfaces for action blocks
export interface FeaturebaseBoard {
  id: string;
  category: string;
  private: boolean;
  segmentIds: string[];
  roles: string[];
  hiddenFromRoles: string[];
  disablePostCreation: boolean;
  disableFollowUpQuestions: boolean;
  customInputFields: string[];
  defaultAuthorOnly: boolean;
  defaultCompanyOnly: boolean;
  icon: object | null;
}

export interface FeaturebaseGetBoardParams {
  id: string;
}

// Custom field-related interfaces for action blocks
export interface FeaturebaseCustomField {
  _id: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "multi-select" | "checkbox";
  required: boolean;
  placeholder: string;
  public: boolean;
  internal: boolean;
  options: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FeaturebaseGetCustomFieldParams {
  id: string;
}

// Survey-related interfaces for action blocks
export interface FeaturebaseSurveyTargeting {
  segmentIds: string[];
  url: Array<{
    value: string;
    matchType: string;
    _id: string;
  }>;
  css: string[];
  loginRequired: boolean;
}

export interface FeaturebaseSurveyPageLogic {
  comparator: string;
  value: number;
  next: {
    type: string;
    pageId?: string;
  };
  _id: string;
}

export interface FeaturebaseSurveyPageDefaultAction {
  type: string;
  pageId?: string;
}

export interface FeaturebaseSurveyPage {
  type: "rating" | "text" | "multiple-choice" | "checkbox";
  title: string;
  description?: string;
  subType?: string;
  scale?: number;
  lowLabel?: string;
  highLabel?: string;
  placeholder?: string;
  logic: FeaturebaseSurveyPageLogic[];
  defaultAction: FeaturebaseSurveyPageDefaultAction;
  _id: string;
}

export interface FeaturebaseSurvey {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  helpcenterMode: boolean;
  organization: string;
  articleId: string | null;
  articleHelpCenterId: string | null;
  responseCount: number;
  targeting: FeaturebaseSurveyTargeting;
  pages: FeaturebaseSurveyPage[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FeaturebaseGetSurveyParams {
  id: string;
}

export interface FeaturebaseGetSurveyResponsesParams {
  id: string;
}

export interface FeaturebaseSurveyResponseUser {
  id: string;
  userId: string;
  organizationId: string;
  customFields: Record<string, any>;
  companies: Array<{
    id: string;
    name: string;
    monthlySpend: number;
    createdAt: string;
    _id: string;
  }>;
  email: string;
  name: string;
  profilePicture: string;
  commentsCreated: number;
  postsCreated: number;
  lastActivity: string;
  subscribedToChangelog: boolean;
  manuallyOptedOutFromChangelog: boolean;
  roles: string[];
  locale: string;
  verified: boolean;
  type: string;
  description: string;
}

export interface FeaturebaseSurveyResponseAnswer {
  pageId: string;
  type: string;
  value: string | number | string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturebaseSurveyResponse {
  _id: string;
  user: FeaturebaseSurveyResponseUser;
  responses: FeaturebaseSurveyResponseAnswer[];
  createdAt: string;
}

// Identify Users-related interfaces for action blocks
export interface FeaturebaseIdentifyUserCompany {
  id: string;
  name: string;
  monthlySpend: number;
  createdAt: string;
  customFields?: Record<string, any>;
  _id?: string;
}

export interface FeaturebaseIdentifyUserRoleDetails {
  name: string;
  id: string;
}

export interface FeaturebaseIdentifiedUser {
  _id?: string;
  fbUserId?: string;
  organization?: string;
  userId?: string;
  externalUserId?: string;
  id?: string;
  name: string;
  email: string;
  profilePicture?: string;
  customFields?: Record<string, any>;
  companies?: FeaturebaseIdentifyUserCompany[];
  roleDetails?: FeaturebaseIdentifyUserRoleDetails;
  commentsCreated?: number;
  postsCreated?: number;
  lastActivity?: string;
  subscribedToChangelog?: boolean;
  manuallyOptedOutFromChangelog?: boolean;
  roles?: string[];
  locale?: string;
  verified?: boolean;
  type?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface FeaturebaseGetIdentifyUserParams {
  email?: string;
  id?: string;
}

export interface FeaturebaseQueryIdentifyUsersParams {
  page?: string;
  limit?: string;
  sortBy?: "topPosters" | "topCommenters" | "lastActivity";
  q?: string;
  segment?: string;
}

export interface FeaturebaseIdentifyUserParams {
  email?: string;
  userId?: string;
  name: string;
  profilePicture?: string;
  subscribedToChangelog?: boolean;
  companies?: FeaturebaseIdentifyUserCompany[];
  customFields?: Record<string, any>;
  createdAt?: string;
  roles?: string[];
  locale?: string;
}

export interface FeaturebaseDeleteUserParams {
  email?: string;
  userId?: string;
}
