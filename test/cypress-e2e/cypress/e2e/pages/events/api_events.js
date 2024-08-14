import ApiBasics from '../api_basic';
class ApiEvents extends ApiBasics {
  #url = 'v1/events';

  constructor() {
    super();
  }

  get() {
    super.get(this.#url);
    cy.get('@response').then((response) => {
      cy.wrap(response.body.events[0].eventId).as('eventId');
    });
  }
}
export default ApiEvents;
