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
  cy.wait(2000)
  cy.get('[formcontrolname="name"]').type(company)
  cy.contains('Salvar').click()
  cy.contains('Cadastrado com sucesso!').should('be.visible')
  cy.get('.btn-close').first().click()
  cy.reload()
})

Cypress.Commands.add('createPort', (
  port = `cy: ${faker.location.city()} port`,
  company = `cy: ${faker.company.name()} Inc`,
  country = 'Brasil'
) => {
  cy.intercept('POST', '**/Ports').as('postPorts')
  cy.contains('Novo').click()
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000)
  cy.get('[formcontrolname="name"]').type(port)
  cy.get(':nth-child(2) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${company}{enter}`)
  cy.get(':nth-child(3) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${country}{enter}`)
  cy.contains('Salvar').click()
  cy.contains('Cadastrado com sucesso!').should('be.visible')
  cy.wait('@postPorts').then((interception) => {
    expect(interception.response.statusCode).to.eq(204)
  })
  cy.get('.btn-close').first().click()
  cy.reload()
})

Cypress.Commands.add('createTerminal', (
  terminal = `cy-${(faker.company.name()).toUpperCase()}`,
  port = `cy: ${faker.location.city()} port`,
) => {
  cy.intercept('POST', '**/Terminals').as('postTerminals')
  cy.contains('Novo').click()
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000)
  cy.get('[formcontrolname="name"]').type(terminal)
  cy.get(':nth-child(2) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${port}{enter}`)
  cy.contains('Salvar').click()
  cy.contains('Cadastrado com sucesso!').should('be.visible')
  cy.wait('@postTerminals').then((interception) => {
    expect(interception.response.statusCode).to.eq(200)
  })
  cy.get('.btn-close').first().click()
  cy.reload()
})