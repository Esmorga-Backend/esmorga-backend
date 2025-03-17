import ApiBasics from '../../api_basic';
class ApiPasswordUpdate extends ApiBasics {
  #url = 'v1/account/password/forgot-update';
  #password = 'SuperSecret1!';
  #forgotPasswordCode = '';
  #email = '';
  constructor() {
    super();
  }
  get_forgotPasswordCode_from_mail(email) {
    this.#forgotPasswordCode = email
      .split('forgotPasswordCode=')[1]
      .split('>')[0];
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
