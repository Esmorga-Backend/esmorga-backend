import ApiBasics from '../../api_basic';
class ApiPasswordUpdate extends ApiBasics {
  #url = 'v1/account/password/forgot-update';
  #password = 'M0!4Much0';
  #forgotPasswordCode = '';
  #email = '';
  constructor() {
    super();
  }
  set_forgotPasswordCode(forgotPasswordCode) {
    this.#forgotPasswordCode = forgotPasswordCode;
    cy.log(this.#forgotPasswordCode);
  }
  get_forgotPasswordCode() {
    return this.#forgotPasswordCode;
  }
  set_password(password) {
    this.#password = password;
  }
  get_password() {
    return this.#password;
  }
  set_email(email) {
    this.#email = email;
  }
  get_email() {
    return this.#email;
  }
  put() {
    super.put(
      this.#url,
      {
        forgotPasswordCode: this.#forgotPasswordCode,
        password: this.#password,
      },
      {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    );
  }
}
export default ApiPasswordUpdate;