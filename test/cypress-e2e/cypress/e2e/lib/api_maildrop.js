//https://api.maildrop.cc/graphql
class ApiMailDrop {
  #login = '';
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
  set_login(login) {
    this.#login = login;
  }
  get_email_dir() {
    if (this.#login == '') {
      this.#login =
        'esmorga.autotest.' + Math.floor(Date.now() / 1000).toString();
    }
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
  get_emails() {
    return new Cypress.Promise((resolve, reject) => {
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
            'query  { inbox(mailbox: "' +
            this.get_email_dir() +
            '") { id mailfrom headerfrom subject date} }',
        },
      }).then((response) => {
        if (response.status == 200) {
          resolve(response.body.data.inbox);
        } else {
          reject('');
        }
      });
    });
  }
  get_email() {
    return new Cypress.Promise((resolve, reject) => {
      cy.request({
        url: 'https://api.maildrop.cc/graphql',
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        failOnStatusCode: false,
        query: `query { inbox(mailbox: "${this.get_email_dir()}") { id mailfrom headerfrom subject date} }`,
      }).then((response) => {
        if (response.status == 200) {
          cy.log('Service is up' + response);
          resolve(response);
        } else {
          cy.log('Service is dwon');
          reject('');
        }
      });
    });
  }
  get_status() {
    return new Cypress.Promise((resolve, reject) => {
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
          resolve(true);
        } else {
          cy.log('Service is dwon');
          reject(false);
        }
      });
    });
  }
}
//query: `query { inbox(mailbox: "${get_email_dir()}") { id mailfrom headerfrom subject date} }`,
export default ApiMailDrop;
