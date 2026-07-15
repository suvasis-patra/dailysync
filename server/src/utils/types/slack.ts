export interface SlackOAuthSuccessResponse {
  ok: true;
  access_token: string;
  token_type: string;
  scope: string;
  bot_user_id: string;
  app_id: string;
  team: {
    name: string;
    id: string;
  };
  authed_user: {
    id: string;
  };
}

interface SlackOAuthErrorResponse {
  ok: false;
  error: string;
}

export type SlackOAuthResponse =
  | SlackOAuthSuccessResponse
  | SlackOAuthErrorResponse;
