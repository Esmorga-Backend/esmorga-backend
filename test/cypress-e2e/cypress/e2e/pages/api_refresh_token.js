import ApiBasics from './api_basic';
class ApiRefreshToken extends ApiBasics {
  #result = '';
  #url = 'v1/account/refresh';
  #refreshToken = '';

  constructor() {
    super();
  }

  post() {
    this.#result = super.post(this.#url, {
      refreshToken: this.#refreshToken,
    });
  }

  check_response() {
    super.check_response(this.#result);
  }
  set_refresh_token(refresh_token) {
    this.#refreshToken = refresh_token;
  }
}
export default ApiRefreshToken;
