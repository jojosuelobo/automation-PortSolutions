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

  it('register a new company', () => {
    const company = `cy: ${faker.company.name()} Inc`
    cy.intercept('POST', '**/companies').as('postCompanies')
    cy.createCompany(company)
    cy.wait('@postCompanies')

    cy.get('[placeholder="Pesquisar..."]').type(company)
    cy.get('.fa-search').click()
    cy.wait('@getCompanies')
    cy.contains('.list', company)
  })

  it('Edit a company', () => {
    const company = `cy: ${faker.company.name()} Inc`
    cy.intercept('POST', '**/companies').as('postCompanies')
    cy.createCompany(company)
    cy.wait('@getCompanies')

    cy.get('[placeholder="Pesquisar..."]').type(company)
    cy.get('.fa-search').click()
    cy.wait('@getCompanies')
    cy.contains('.list', company)

    cy.intercept('PUT', '**/companies/**').as('putCompanies')
    const newCompany = `cy: ${faker.company.name()} Inc`
    cy.get('.fa-pencil').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.get('[formcontrolname="name"]').clear()
    cy.get('[formcontrolname="name"]').type(newCompany)
    cy.contains('Alterar').click()
    cy.wait('@putCompanies').then((interception) => {
      expect(interception.response.statusCode).to.eq(204)
    })
    cy.contains('Atualizado com sucesso!').should('be.visible')
    cy.get('.btn-close').first().click()
    cy.reload()
    cy.wait('@getCompanies')
    cy.get('[placeholder="Pesquisar..."]').type(newCompany)
    cy.get('.fa-search').click()
    cy.wait('@getCompanies')
    cy.contains('.list', newCompany)
  })

  it('Delete a company', () => {
    const company = `cy: ${faker.company.name()} Inc`
    cy.intercept('POST', '**/companies').as('postCompanies')
    cy.createCompany(company)
    cy.wait('@getCompanies')

    cy.get('[placeholder="Pesquisar..."]').type(company)
    cy.get('.fa-search').click()
    cy.wait('@getCompanies')
    cy.contains('.list', company)

    cy.intercept('DELETE', '**/companies/**').as('deleteCompanies')
    cy.get('.fa-trash-can').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.contains('.btn', 'Deletar').click()
    cy.contains('Removido com sucesso!').should('be.visible')
    cy.wait('@deleteCompanies').then((interception) => {
      expect(interception.response.statusCode).to.eq(204)
    })
    cy.wait('@getCompanies')
    cy.get('[placeholder="Pesquisar..."]').type(company)
    cy.get('.fa-search').click()
    cy.wait('@getCompanies')
    cy.contains(company).should('not.exist')

  })

})