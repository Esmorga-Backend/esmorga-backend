import Api1Secmail from './api_1secmail';
const api_1secmail = new Api1Secmail();
import ApiMailDrop from './api_maildrop';
const api_mail_drop = new ApiMailDrop();
import ApiMailEsmorga from './api_mailesmorga';
const api_mailesmorga = new ApiMailEsmorga();

class AllApis {
  defautl_api;
  api_1secmail;
  api_mail_drop;
  api_mailesmorga;

  constructor() {
    this.api_1secmail = api_1secmail;
    this.api_mail_drop = api_mail_drop;
    this.api_mailesmorga = api_mailesmorga;
    this.defautl_api = api_1secmail;
  }

  check_if_service_is_up() {
    if (this.api_1secmail.check_if_service_is_up()) {
      this.defautl_api = this.api_1secmail;
    } else if (this.api_mailesmorga.check_if_service_is_up()) {
      this.defautl_api = this.api_mailesmorga;
      //   } else if (this.api_mail_drop.check_if_service_is_up()) {
      //     this.defautl_api = this.api_mail_drop;
    }
    this.print_name();
  }
  print_name() {
    cy.log('Default API: ' + this.defautl_api.get_name());
  }
  get_email_dir() {
    return this.defautl_api.get_email_dir();
  }
  get_email() {
    this.defautl_api.get_email().then((email) => {
      cy.wrap(email).as('email');
    });
  }
  get_emails() {
    this.defautl_api.get_emails();
  }
  makeRequestWithRetries(url, options, retries = 3, delay = 15000) {
    return new Cypress.Promise((resolve, reject) => {
      cy.request({
        url,
        ...options,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 500 && retries > 0) {
          cy.wait(delay).then(() => {
            makeRequestWithRetries(url, options, retries - 1, delay)
              .then(resolve)
              .catch(reject);
          });
        } else if (response.status === 500) {
          reject(new Error('Server returned 500 after all retries'));
        } else {
          resolve(response);
        }
      });
    });
  }
}
export default AllApis;
