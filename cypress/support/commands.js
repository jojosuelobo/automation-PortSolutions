import { faker } from '@faker-js/faker'

Cypress.Commands.add('guiLogin', (
  username = Cypress.env('LOGIN'),
  password = Cypress.env('PASSWORD')
) => {
  cy.visit('/login')
  cy.get('[formcontrolname="login"]').type(username)
  cy.get('[formcontrolname="password"]').type(password)
  cy.get('[name="submit"]').click()
})

Cypress.Commands.add('sessionLogin', (
  username = Cypress.env('LOGIN'),
  password = Cypress.env('PASSWORD')
) => {
  const login = () => cy.guiLogin(username, password)
  cy.session(username, login)
})

Cypress.Commands.add('createCompany', (
  company = `cy: ${faker.company.bs()} Inc`
) => {
  cy.contains('Novo').click()
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000)
  cy.get('[formcontrolname="name"]').type(company)
  cy.contains('Salvar').click()

  cy.wait('@postCompanies').then((interception) => {
    expect(interception.response.statusCode).to.eq(204)
  })
  cy.contains('Cadastrado com sucesso!').should('be.visible')
  cy.get('.btn-close').first().click()
  cy.reload()
})