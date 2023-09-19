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
    const company = `cy: ${faker.company.bs()} Inc`
    cy.intercept('POST', '**/companies').as('postCompanies')

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
    cy.wait('@getCompanies')

    cy.get('[placeholder="Pesquisar..."]').type(company)
    cy.get('.fa-search').click()
    cy.wait('@getCompanies')
    cy.contains('.list', company)
  })

  it.only('Edit a company', () => {
    const company = `cy: ${faker.company.bs()} Inc`
    cy.intercept('POST', '**/companies').as('postCompanies')
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
    cy.wait('@getCompanies')
    cy.get('[placeholder="Pesquisar..."]').type(company)
    cy.get('.fa-search').click()
    cy.wait('@getCompanies')
    cy.contains('.list', company)

    cy.intercept('PUT', '**/companies/**').as('putCompanies')
    const newCompany = `cy: ${faker.company.bs()} Inc`
    cy.get('.fa-pencil').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
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

})