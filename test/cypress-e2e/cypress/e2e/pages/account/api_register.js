import ApiBasics from '../api_basic';
import AllApis from '../../lib/all_mail_apis';
const allapis = new AllApis();
class ApiRegister extends ApiBasics {
  #url = 'v1/account/register';
  #email = 'auto.esmorga.test@1secmail.com';
  #password = 'SuperSecret1!';
  #name = 'Auto Esmorga';
  #lastName = 'Test';
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
      case 'name':
        this.#name = text;
        break;
      case 'lastName':
        this.#lastName = text;
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
        name: this.#name,
        lastName: this.#lastName,
      },
      {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    );
  }
  check_email() {
    allapis.print_name();
    cy.wait(30000);
    allapis.get_email();
    /*
    api_1secmail.get_emails();
    cy.get('@response').then((response) => {
      api_1secmail.get_email(response.body[0].id);
      cy.get('@response').then((response) => {
        cy.wrap(response.body).as('email');
      });
    });
    */
  }
}
export default ApiRegister;
