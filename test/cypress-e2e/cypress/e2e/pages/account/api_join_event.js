import ApiBasics from '../api_basic';

class ApiJoinEvent extends ApiBasics {
  #url = 'v1/account/events';
  #eventId = '66b0adc97e30c9228d2b36e3';
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
