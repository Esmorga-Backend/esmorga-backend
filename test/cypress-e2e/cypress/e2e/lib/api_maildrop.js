//https://api.maildrop.cc/graphql
class ApiMailDrop {
  #login = 'auto.esmorga.test';
  #name = 'maildrop';
  #domain = 'maildrop.cc';
  constructor() {}
  get_name() {
    return this.#name;
  }

  check_if_service_is_up() {
    return new Cypress.Promise((resolve, reject) => {
      cy.request({
        url: 'https://api.maildrop.cc/graphql',
        method: 'POST',
        header: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        failOnStatusCode: false,
        body: { query: 'query Example {\n  status\n}' },
      }).then((response) => {
        if (response.status == 200) {
          cy.log('Service is up');
          resolve(true);
        } else {
          cy.log('Service is dwon');
          reject(false);
        }
      });
    });
  }
  get_email_dir() {
    return this.#login + '@' + this.#domain;
  }

  get_user_alias() {
    cy.request({
      url: 'https://api.maildrop.cc/graphql',
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      failOnStatusCode: false,
      body: {
        query:
          '{"query":"query Example { altinbox(mailbox:"' +
          this.#login +
          '") }"}',
      },
    }).then((response) => {
      if (response.status == 200) {
        cy.log('@Email' + response.body);
        return response.body.data.altinbox;
      }
    });
  }
  get_email() {
    cy.request({
      url: 'https://api.maildrop.cc/graphql',
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      failOnStatusCode: false,
      body: {
        query:
          'query PingSample { \
          ping(message: "Hello, world!") \
        }',
      },
    }).then((response) => {
      if (response.status == 200) {
        cy.log('Service is up');
        return true;
      } else {
        cy.log('Service is dwon');
        return false;
      }
    });
  }
}
export default ApiMailDrop;
