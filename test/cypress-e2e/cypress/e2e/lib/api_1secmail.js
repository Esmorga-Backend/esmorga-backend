class Api1Secmail {
  #login = 'auto.esmorga.test';
  #domain = '1secmail.com';
  #name = '1secmail';
  constructor() {}
  get_name() {
    return this.#name;
  }
  check_if_service_is_up() {
    cy.request({
      url: 'https://www.1secmail.com/api/v1/',
      options: {
        method: 'GET',
      },
      failOnStatusCode: false,
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
