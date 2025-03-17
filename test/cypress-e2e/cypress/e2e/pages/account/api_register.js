import ApiBasics from '../api_basic';
import AllApis from '../../lib/all_mail_apis';
const allapis = new AllApis();
class ApiRegister extends ApiBasics {
  #url = 'v1/account/register';
  #email = '';
  #password = 'SuperSecret1!';
  #name = 'Auto Esmorga';
  #lastName = 'Test';
  #defaultPassword = this.#password;

  constructor() {
    super();
  }
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
    if (this.#email == '') {
      allapis.check_if_service_is_up();
      this.#email = allapis.get_email_dir();
    }
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
    cy.log('Checking ' + allapis.get_email_dir() + ' email');
    allapis.get_email();
  }
}
export default ApiRegister;
