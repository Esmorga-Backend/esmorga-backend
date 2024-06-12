class ApiBasics{

    get(url){
        return cy.request('GET', Cypress.config().baseUrl + url)
    
    }
    check_response(result){
        return result.then((response) => {
            expect(response.status).to.eq(200);
          })
    
    }

}
export default ApiBasics