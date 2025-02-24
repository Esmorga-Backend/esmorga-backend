import Api1Secmail from './api_1secmail';
const api_1secmail = new Api1Secmail();
import ApiMailDrop from './api_maildrop';
const api_mail_drop = new ApiMailDrop();

class AllApis {
  defautl_api;
  api_1secmail;
  api_mail_drop;
  constructor() {
    this.api_1secmail = api_1secmail;
    this.api_mail_drop = api_mail_drop;
    this.defautl_api = api_1secmail;
  }

  check_if_service_is_up() {
    if (this.api_1secmail.check_if_service_is_up()) {
      this.defautl_api = this.api_1secmail;
    } else if (this.api_mail_drop.check_if_service_is_up()) {
      this.defautl_api = this.api_mail_drop;
    }
  }
  print_name() {
    cy.log('Default API: ' + this.defautl_api.get_name());
  }
  get_email_dir() {
    this.check_if_service_is_up();
    cy.log('que se mostrara primero? ' + this.defautl_api.get_email_dir());
    // cy.log(' Email: ' + this.defautl_api.get_email_dir());
    // return this.defautl_api.get_email_dir();
    return '?';
  }
  get_email() {
    this.defautl_api.get_email();
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
