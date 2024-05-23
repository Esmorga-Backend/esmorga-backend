class ApiEvents{
    #result=''
    url='v1/events'
    get(){
        this.#result=cy.request('GET', Cypress.config().baseUrl + 'v1/events')
    
    }
    check(){
        this.#result.then((response) => {
            expect(response.status).to.eq(200);
          })
    
    }

}
export default ApiEvents