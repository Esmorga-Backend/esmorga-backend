import ApiBasics from '../api_basic';
class ApiRefreshToken extends ApiBasics {
  #url = 'v1/account/refresh';
  #refreshToken = '';

  constructor() {
    super();
  }

  post() {
    cy.get('@refreshToken').then((refreshToken) => {
      this.#refreshToken = refreshToken;

      super.post(
        this.#url,
        {
          refreshToken: this.#refreshToken,
        },
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      );
    });
    cy.get('@response').then((response) => {
      cy.wrap(response.body.refreshToken).as('refreshToken');
    });
  }
}
export default ApiRefreshToken;
