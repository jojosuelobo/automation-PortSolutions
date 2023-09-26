/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('terminal section test', () => {

    const terminal = `CY: ${(faker.company.name()).toUpperCase()}`
    const port = `cy: ${faker.location.city()} port`
    const company = `cy: ${faker.company.name()} Inc`

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

    it('Register a new terminal', () => {
        AcessPortsAndCreatePort(port, company)
        AcessTerminals()
        cy.createTerminal(terminal, port)

        cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(terminal)
        cy.get('.fa-search').as('SearchIcon').click()
        cy.wait('@getTerminals')
        cy.contains('.list', port)
    })

    it('Edit and Delete a terminal', () => {
        const newTerminal = `CY: ${(faker.company.name()).toUpperCase()}`
        const newPort = `cy: ${faker.location.city()} port`
        const newCompany = `cy: ${faker.company.name()} Inc`

        // Register a new terminal
        AcessPortsAndCreatePort(newPort, newCompany)
        AcessTerminals()
        cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(terminal)
        cy.get('.fa-search').as('SearchIcon').click()
        cy.wait('@getTerminals')
        cy.contains('.list', terminal)

        // Edit the terminal
        cy.intercept('PUT', '**/Terminals/**').as('putTerminals')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.get('.fa-pencil').as('Edit').click()
        // Necessário adicionar timer de 1s para renderização da tela
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.get('[formcontrolname="name"]').clear()
        cy.get('[formcontrolname="name"]').type(newTerminal)
        cy.get(':nth-child(2) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${newPort}{enter}`)
        cy.contains('Salvar').click()
        cy.contains('Atualizado com sucesso!').should('be.visible')
        cy.wait('@putTerminals').then((interception) => {
            expect(interception.response.statusCode).to.eq(204)
        })
        cy.get('.btn-close').first().click()
        cy.reload()
        cy.get('@SearchInput').type(newPort)
        cy.get('@SearchIcon').click()
        cy.wait('@getPorts')
        cy.contains('.list', newPort)
    })
})