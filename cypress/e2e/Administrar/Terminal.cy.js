/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('terminal section test', () => {

  function AcessCompanyAndCreateCompany(companyReference) {
    cy.intercept('GET', '**/companies/**').as('getCompanies')
    cy.contains('Administrar').click()
    cy.contains('Empresas').click()
    cy.wait('@getCompanies')
    cy.createCompany(companyReference)
  }

  function AcessPortsAndCreatePort(portReference, companyReference) {
    AcessCompanyAndCreateCompany(companyReference)
    cy.intercept('GET', '**/ports/**').as('getPorts')
    cy.contains('Administrar').click()
    cy.contains('Portos').click()
    cy.wait('@getPorts')
    cy.createPort(portReference, companyReference)
  }

  function AcessTerminals() {
    cy.intercept('GET', '**/terminals/**').as('getTerminals')
    cy.contains('Administrar').click()
    cy.contains('Terminais').click()
    cy.wait('@getTerminals')
  }

  beforeEach(() => {
    cy.guiLogin()
  })

  it.only('Register, Edit and Delete a terminal', () => {
    // Register and Check a terminal
    const terminal = `Terminal ${(faker.lorem.sentence(3))}`
    const port = `Porto ${faker.location.city()}`
    const company = `${faker.company.name()}`

    AcessPortsAndCreatePort(port, company)
    AcessTerminals()
    cy.createTerminal(terminal, port)
    cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(terminal, { delay: 0 })
    cy.get('.fa-search').as('SearchIcon').click()
    cy.wait('@getTerminals')
    cy.get('.list').find('tr').should('have.length', 1).contains(terminal)

    const newTerminal = `New Terminal ${(faker.lorem.sentence(3))}`
    const newPort = `New Porto ${faker.location.city()}`
    const newCompany = `New ${faker.company.name()}`

    // Register a new terminal for EDIT mode
    AcessPortsAndCreatePort(newPort, newCompany)
    AcessTerminals()
    cy.get('@SearchInput').type(`{selectall}${terminal}`, { delay: 0 })
    cy.get('@SearchIcon').click()
    cy.wait('@getTerminals')
    cy.get('.list').find('tr').should('have.length', 1).contains(terminal)

    // Edit the terminal
    cy.get('.fa-pencil').as('Edit').click()
    cy.wait(500)
    cy.get('[formcontrolname="name"]').type(`{selectall}${newTerminal}`, { delay: 0 })
    cy.get(':nth-child(2) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${newPort}{enter}`, { delay: 0 })
    cy.contains('Salvar').click()
    cy.contains('Atualizado com sucesso!').should('be.visible')
    cy.get('#staticBackdrop > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click()

    cy.get('@SearchInput').type(`{selectall}${newTerminal}`, { delay: 0 })
    cy.get('@SearchIcon').click()
    cy.wait('@getPorts')
    cy.get('.list').find('tr').should('have.length', 1).contains(newTerminal)

    // Delete created terminal
    cy.get('.fa-trash-can').click()
    cy.contains('.btn', 'Deletar').click()
    cy.contains('Removido com sucesso!').should('be.visible')
    cy.get('#closeModal').click({ force: true })
    cy.get('@SearchInput').type(`{selectall}${newTerminal}`, { delay: 0 })
    cy.get('@SearchIcon').click()
    cy.get('.list').find('tr').should('have.length', 0)
  })
})