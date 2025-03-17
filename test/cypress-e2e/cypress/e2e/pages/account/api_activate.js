import ApiBasics from '../api_basic';
class ApiActivate extends ApiBasics {
  #url = 'v1/account/activate';
  #verificationCode = '';
  constructor() {
    super();
  }
  get_verificationCode_from_mail(email) {
    this.#verificationCode = email.split('verificationCode=')[1].split('>')[0];
  }
  get_verificationCode() {
    return this.#verificationCode;
  }
  set_verificationCode(verificationCode) {
    this.#verificationCode = verificationCode;
  }
  put() {
    super.put(
      this.#url,
      {
        verificationCode: this.#verificationCode,
      },
      {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    );
  }
}
export default ApiActivate;
