/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('companies sections test', () => {
  beforeEach(() => {
    cy.guiLogin()
    cy.intercept('GET', '**/companies/**').as('getCompanies')
    cy.contains('Administrar').click()
    cy.contains('Empresas').click()
    cy.wait('@getCompanies')
  })

  it('register new company', () => {
    const company = `cy: ${faker.company.bs()} Inc`
    cy.intercept('POST', '**/companies').as('postCompanies')

    cy.contains('Novo').click()
    cy.get('[formcontrolname="name"]').type(company)
    cy.contains('Salvar').click()

    cy.wait('@postCompanies').then((interception) => {
      expect(interception.response.statusCode).to.eq(204)
    })
    cy.contains('Cadastrado com sucesso!').should('be.visible')
    // Ainda falta corrigir o click no X para fechar a modal de sucesso para então fechar está aba.
    cy.contains('Fechar').click()

    cy.contains('.list', company).should('be.visible')

  })

})