import ApiBasics from '../api_basic';
import ApiLogin from './api_login';
const api_login = new ApiLogin();

class ApiJoinEvent extends ApiBasics {
  #url = 'v1/account/events';
  #eventId = '66697f9a3c001d5dfd76bd4d';
  #accessToken = '';
  constructor() {
    super();
  }

  post() {
    cy.get('@accessToken').then((accessToken) => {
      this.#accessToken = accessToken;

      super.post(
        this.#url,
        {
          eventId: this.#eventId,
        },
        {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      );
    });
  }
}
export default ApiJoinEvent;
