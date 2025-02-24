import ApiBasics from '../../api_basic';
import AllApis from '../../../lib/all_mail_apis';
const allapis = new AllApis();
class ApiForgotPassword extends ApiBasics {
  #url = 'v1/account/password/forgot-init';
  #email = 'auto.esmorga.test@1secmail.com';
  constructor() {
    super();
  }
  update_email() {
    this.#email = allapis.get_email_dir();
  }

  get_email_dir() {
    return this.#email;
  }

  post() {
    this.update_email();
    super.post(
      this.#url,
      {
        email: this.#email,
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
export default ApiForgotPassword;
