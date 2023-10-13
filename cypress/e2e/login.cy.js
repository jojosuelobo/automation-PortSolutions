/// <reference types="cypress" />

describe('Login into Port Solution', () => {
  it('login', () => {
    cy.intercept('POST', '**/authenticate').as('postAuthentication')
    cy.guiLogin()
    cy.wait('@postAuthentication').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.contains('span', 'Portsolutions').should('be.visible')
  })
})