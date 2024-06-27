class ApiBasics {
  get(url) {
    return cy.request('GET', Cypress.config().baseUrl + url);
  }
  post(url, data) {
    return cy.request('POST', Cypress.config().baseUrl + url, data);
  }
  check_response(result, code) {
    return result.then((response) => {
      expect(response.status).to.eq(code);
    });
  }
}
export default ApiBasics;
