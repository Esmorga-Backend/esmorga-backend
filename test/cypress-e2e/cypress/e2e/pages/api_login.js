import ApiBasics from './api_basic';
class ApiLogin extends ApiBasics {
  #result = '';
  #url = 'v1/account/login';
  #email = '';
  #password = '';
  #refreshToken = '';

  constructor() {
    super();
  }

  set_email(email) {
    this.#email = email;
  }
  set_password(password) {
    this.#password = password;
  }

  post() {
    this.#result = super.post(this.#url, {
      email: this.#email,
      password: this.#password,
    });
    cy.wait(5000);
  }

  check_response(code) {
    super.check_response(this.#result, code);
  }
  get_refresh_token() {
    this.#result.then((response) => {
      this.#refreshToken = response.body.refreshToken;
    });
    cy.wait(1000);
    console.log(this.#refreshToken);
    return this.#refreshToken;
  }
}
export default ApiLogin;
