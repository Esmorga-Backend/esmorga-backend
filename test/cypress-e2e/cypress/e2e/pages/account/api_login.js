import ApiBasics from '../api_basic';
class ApiLogin extends ApiBasics {
  #url = 'v1/account/login';
  #email = 'esmorga.test.06@yopmail.com';
  #password = 'Password!6';
  #defaultPassword = this.#password;
  /*
  constructor() {
    super();
  }
  */
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

    console.log(this);
  }
  post() {
    console.log(this);
    cy.wait(1000);
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
