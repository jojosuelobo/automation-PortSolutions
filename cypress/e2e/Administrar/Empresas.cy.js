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

  it('Register, Edit and Delete a company', () => {
    const company = `${faker.company.name()}`
    cy.createCompany(company)
    cy.wait('@getCompanies')

    cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(company)
    cy.get('.fa-search').as('SearchButton').click()
    cy.wait('@getCompanies')
    cy.get('.list').find('tr').should('have.length', 1).contains(company)

    const newCompany = `${faker.company.name()}`
    cy.get('.fa-pencil').click()
    cy.wait(500)
    cy.get('[formcontrolname="name"]').type(`{selectall}${newCompany}`, { delay: 0 })
    cy.contains('Alterar').click()
    cy.contains('Atualizado com sucesso!').should('be.visible')
    cy.get(':nth-child(2) > lg-toast > .toast > .toast-header > .btn-close').click()
    cy.get('#staticBackdrop > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click()

    cy.get('@SearchInput').type(`{selectall}${newCompany}`, { delay: 0 })
    cy.get('@SearchButton').click()
    cy.get('.list').find('tr').should('have.length', 1).contains(newCompany)

    cy.wait(500)
    cy.get('.fa-trash-can').click()
    cy.contains('.btn', 'Deletar').click()
    cy.contains('Removido com sucesso!').should('be.visible')
    cy.get(':nth-child(3) > lg-toast > .toast > .toast-header > .btn-close').click()
    cy.get('#closeModal').click({ force: true })
    cy.get('@SearchInput').type(`{selectall}${newCompany}`, { delay: 0 })
    cy.get('@SearchButton').click()
    cy.get('.list').find('tr').should('have.length', 0)
  })
})