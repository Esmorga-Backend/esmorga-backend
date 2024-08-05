import ApiBasics from '../api_basic';
class ApiEvents extends ApiBasics {
  #url = 'v1/events';

  constructor() {
    super();
  }

  get() {
    super.get(this.#url);
  }
}
export default ApiEvents;
