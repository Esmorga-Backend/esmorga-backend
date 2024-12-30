function makeRequestWithRetries(url, options, retries = 3, delay = 15000) {
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
class Api1Secmail {
  #login = 'auto.esmorga.test';
  #domain = '1secmail.com';

  get_emails() {
    makeRequestWithRetries(
      'https://www.1secmail.com/api/v1/?action=getMessages&login=' +
        this.#login +
        '&domain=' +
        this.#domain,
      { method: 'GET' },
    )
      .then((response) => {
        cy.wrap(response).as('response');
        expect(response.status).to.not.equal(500);
      })
      .catch((error) => {
        cy.log(error.message);
      });

    cy.wait(1000);
  }
  get_email(id) {
    makeRequestWithRetries(
      'https://www.1secmail.com/api/v1/?action=readMessage&login=' +
        this.#login +
        '&domain=' +
        this.#domain +
        '&id=' +
        id,
      { method: 'GET' },
    )
      .then((response) => {
        cy.wrap(response).as('response');
        expect(response.status).to.not.equal(500);
      })
      .catch((error) => {
        cy.log(error.message);
      });

    cy.wait(1000);
  }
}
export default Api1Secmail;
