import ApiBasics from '../../api_basic';
import Api1Secmail from '../../../lib/api_1secmail';
const api_1secmail = new Api1Secmail();
class ApiForgotPassword extends ApiBasics {
  #url = 'v1/account/password/forgot-init';
  #email = 'auto.esmorga.test@1secmail.com';
  constructor() {
    super();
  }
  get_email() {
    return this.#email;
  }
  post() {
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
    cy.wait(30000);
    api_1secmail.get_emails();
    cy.get('@response').then((response) => {
      api_1secmail.get_email(response.body[0].id);
      cy.get('@response').then((response) => {
        cy.wrap(response.body).as('email');
      });
    });
  }
}
export default ApiForgotPassword;
