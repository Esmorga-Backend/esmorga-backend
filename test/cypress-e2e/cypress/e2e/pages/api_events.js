import ApiBasics from './api_basic';
class ApiEvents extends ApiBasics {
  #result = '';
  #url = 'v1/events';

  constructor() {
    super();
  }

  get() {
    this.#result = super.get(this.#url);
  }

  check_response(code) {
    super.check_response(this.#result, code);
  }
}
export default ApiEvents;
