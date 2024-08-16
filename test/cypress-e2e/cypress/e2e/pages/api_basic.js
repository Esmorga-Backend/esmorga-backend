class ApiBasics {
  get(url) {
    cy.request('GET', Cypress.config().baseUrl + url).as('response');
    cy.wait(1000);
  }
  post(url, data, headers) {
    cy.request({
      method: 'POST',
      url: Cypress.config().baseUrl + url,
      body: data,
      headers: headers,
      failOnStatusCode: false,
    }).as('response');
    cy.wait(1000);
  }

  check_response(code, response) {
    expect(code).to.eq(response.status);
  }
  check_error_response(code, result, response) {
    expect(code).to.eq(response.status);
    expect(result).to.eq(response.body.errors[0]);
  }
}
export default ApiBasics;
