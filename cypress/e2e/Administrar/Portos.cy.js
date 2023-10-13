/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('companies sections test', () => {
  /**
     * Entra para pÃ¡gina de EMPRESAS e cadastra nova empresa
     *
     * @param companyReference String - Nome da empresa a ser cadastrada
    */
  function AcessCompanyAndCreateCompany(companyReference) {
    cy.intercept('GET', '**/companies/**').as('getCompanies')
    cy.contains('Administrar').click()
    cy.contains('Empresas').click()
    cy.wait('@getCompanies')
    cy.createCompany(companyReference)
  }

  /**
     * Entra para pÃ¡gina de PORTOS
     *
    */
  function AcessPorts() {
    cy.intercept('GET', '**/ports/**').as('getPorts')
    cy.contains('Administrar').click()
    cy.contains('Portos').click()
    cy.wait('@getPorts')
  }

  beforeEach(() => {
    cy.guiLogin()
  })

  it('Register, Edit and Delete a Port', () => {
    const port = `Porto de ${faker.location.city()}`
    const company = `${faker.company.name()}`

    const newCompany = `${faker.company.name()}`
    const newPort = `Ports ${faker.location.city()}`

    AcessCompanyAndCreateCompany(company)
    cy.reload()
    AcessCompanyAndCreateCompany(newCompany)

    AcessPorts()
    cy.createPort(port, company)

    cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(port, { delay: 0 })
    cy.get('.fa-search').as('SearchIcon').click()
    cy.wait('@getPorts')
    cy.get('.list').find('tr').should('have.length', 1).contains(port)

    cy.get('.fa-pencil').as('Edit').click()
    cy.wait(500)
    cy.get('[formcontrolname="name"]').type(`{selectall}${newPort}`, { delay: 0 })
    cy.get(':nth-child(2) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${newCompany}{enter}`, { delay: 0 })
    cy.get(':nth-child(3) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type('Argentina{enter}', { delay: 0 })
    cy.contains('Salvar').click()
    cy.contains('Atualizado com sucesso!').should('be.visible')
    cy.get(':nth-child(3) > lg-toast > .toast > .toast-header > .btn-close')
    cy.get('#staticBackdrop > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click()

    cy.get('@SearchInput').type(`{selectall}${newPort}`, { delay: 0 })
    cy.get('@SearchIcon').click()
    cy.wait('@getPorts')
    cy.get('.list').find('tr').should('have.length', 1).contains(newPort)

    cy.get('.fa-trash-can').as('DeleteIcon').click()
    cy.contains('.btn', 'Deletar').click()
    cy.contains('Removido com sucesso!').should('be.visible')
    cy.get('#staticBackdrop > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click({force: true})
    cy.get('#error-modal > .modal-dialog > .modal-content > .position-absolute > .btn-close').click({force: true})
    cy.wait('@getPorts')
    cy.get('@SearchInput').type(`{selectall}${newPort}`, { delay: 0 })
    cy.get('@SearchIcon').click()
    cy.wait('@getCompanies')
    cy.get('.list').find('tr').should('have.length', 0)
  })

})