import ApiBasics from '../api_basic';
class ApiLogin extends ApiBasics {
  #url = 'v1/account/login';
  #email = 'esmorga.test.01@yopmail.com';
  #password = 'Password01';

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
    });
  }
}
export default ApiLogin;
