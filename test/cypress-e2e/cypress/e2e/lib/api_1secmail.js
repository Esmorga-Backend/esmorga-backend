class Api1Secmail {
  #login = 'auto.esmorga.test';
  #domain = '1secmail.com';

  get_emails() {
    cy.request(
      'GET',
      'https://www.1secmail.com/api/v1/?action=getMessages&login=' +
        this.#login +
        '&domain=' +
        this.#domain,
    ).as('response');
    cy.wait(1000);
  }
  get_email(id) {
    cy.request(
      'GET',
      'https://www.1secmail.com/api/v1/?action=readMessage&login=' +
        this.#login +
        '&domain=' +
        this.#domain +
        '&id=' +
        id,
    ).as('response');
    cy.wait(1000);
  }
}
export default Api1Secmail;
