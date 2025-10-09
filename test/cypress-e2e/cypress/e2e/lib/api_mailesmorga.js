//https://api.maildrop.cc/graphql
class ApiMailEsmorga {
  #login = '';
  #name = 'mailesmorga';
  #domain = 'esmorgaevents.com';
  constructor() {}
  get_name() {
    return this.#name;
  }

  check_if_service_is_up() {
    return new Cypress.Promise((resolve, reject) => {
      cy.log(Cypress.env('MOCK_SERVER_USERNAME'));
      cy.request({
        url: 'https://mail.esmorgaevents.com/messages',
        method: 'GET',
        auth: {
          username: Cypress.env('MOCK_SERVER_USERNAME'),
          password: Cypress.env('MOCK_SERVER_PASSWORD'),
        },
        failOnStatusCode: false,
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

  get_emails() {
    return new Cypress.Promise((resolve, reject) => {
      cy.request({
        url: 'https://mail.esmorgaevents.com/messages',
        method: 'GET',
        auth: {
          username: Cypress.env('MOCK_SERVER_USERNAME'),
          password: Cypress.env('MOCK_SERVER_PASSWORD'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status == 200) {
          resolve(response.body);
        } else {
          reject('');
        }
      });
    });
  }

  get_email() {
    let filtred_emails = [];
    cy.wait(3000);
    return this.get_emails().then((res) => {
      //cy.log(res);
      //cy.log(JSON.stringify(res));
      filtred_emails = res.filter((emails) =>
        emails.recipients.includes('<' + this.get_email_dir() + '>'),
      );
      cy.log(this.get_email_dir());

      cy.log(filtred_emails);

      cy.log(JSON.stringify(filtred_emails[filtred_emails.length - 1]));

      return new Cypress.Promise((resolve, reject) => {
        cy.request({
          url:
            'https://mail.esmorgaevents.com/messages/' +
            filtred_emails[filtred_emails.length - 1].id +
            '.html',
          method: 'GET',
          auth: {
            username: Cypress.env('MOCK_SERVER_USERNAME'),
            password: Cypress.env('MOCK_SERVER_PASSWORD'),
          },
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status == 200) {
            resolve(response.body);
          } else {
            reject('');
          }
        });
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
export default ApiMailEsmorga;
