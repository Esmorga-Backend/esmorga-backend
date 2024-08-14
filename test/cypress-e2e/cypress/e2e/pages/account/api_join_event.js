import ApiBasics from '../api_basic';

class ApiJoinEvent extends ApiBasics {
  #url = 'v1/account/events';
  #eventId = '';
  #accessToken = '';
  constructor() {
    super();
  }

  post() {
    cy.get('@accessToken').then((accessToken) => {
      cy.get('@eventId').then((eventId) => {
        super.post(
          this.#url,
          {
            eventId: eventId,
          },
          {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        );
      });
    });
  }
}
export default ApiJoinEvent;
