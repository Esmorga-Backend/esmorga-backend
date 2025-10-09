import ApiBasics from '../api_basic';
class ApiLogin extends ApiBasics {
  #url = 'v1/account/login';
  #email = 'auto.esmorga.test@api.esmorgaevents.com';
  #password = 'SuperSecret1!';
  #defaultPassword = this.#password;
  set_email(email) {
    this.#email = email;
  }
  set_password(password) {
    this.#password = password;
  }
  restore_password() {
    this.#password = this.#defaultPassword;
  }
  set_email(email) {
    this.#email = email;
  }
  set_field(field, text) {
    switch (field) {
      case 'email':
        this.#email = text;
        break;
      case 'password':
        this.#password = text;
        break;
    }
  }
  post() {
    super.post(
      this.#url,
      {
        email: this.#email,
        password: this.#password,
      },
      {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    );

    cy.get('@response').then((response) => {
      cy.wrap(response.body.refreshToken).as('refreshToken');
      cy.wrap(response.body.accessToken).as('accessToken');
    });
  }
}
export default ApiLogin;
