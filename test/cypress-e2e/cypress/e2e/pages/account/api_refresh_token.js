import ApiBasics from '../api_basic';
class ApiRefreshToken extends ApiBasics {
  #url = 'v1/account/refresh';
  #refreshToken = '';

  constructor() {
    super();
  }

  post() {
    super.post(
      this.#url,
      {
        refreshToken: this.#refreshToken,
      },
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    );
  }

  set_refresh_token(refresh_token) {
    this.#refreshToken = refresh_token;
  }
}
export default ApiRefreshToken;
