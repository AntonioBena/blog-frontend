export class ApiConstants {
  public static readonly BASE_AUTH_ENDPOINT =
    'http://localhost:8080/api/v1/auth';
  public static readonly REGISTER_ENDPOINT = '/register';
  public static readonly LOGIN_ENDPOINT = '/login';
  public static readonly ACTIVATE_ACCOUNT_ENDPOINT = '/activate-account';
  public static readonly ACTIVATE_ACCOUNT_PARAM = 'activationCode';
  public static readonly APPLICATION_JSON = 'application/json';
  public static readonly FILE_TYPE = 'text/html';
  public static readonly TOKEN = "auth_token";

  public static readonly BASE_BLOG_POST_URL = 'http://localhost:8080/api/v1/blog';
}
