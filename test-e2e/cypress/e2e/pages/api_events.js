import ApiBasics from "./api_basic"
class ApiEvents extends ApiBasics{
    #result=''
    #url='v1/events'

    constructor() {
        super();
    }

    get(){
        this.#result=super.get(this.#url)
    }

    check_response(){
        super.check_response(this.#result)    
    }

}
export default ApiEvents