/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('companies sections test', () => {

    /** 
     * Entra para página de EMPRESAS e cadastra nova empresa
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
     * Entra para página de PORTOS
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
        // Register a new PORT
        const port = `cy: ${faker.location.city()} port`
        const company = `cy: ${faker.company.name()} Inc`
        AcessCompanyAndCreateCompany(company)
        AcessPorts()
        cy.createPort(port, company)
        cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(port)
        cy.get('.fa-search').as('SearchIcon').click()
        cy.wait('@getPorts')
        cy.contains('.list', port)

        // Edit the pre created port with a new name and company
        const newPort = `cy: ${faker.location.city()} port`
        const newCompany = `cy: ${faker.company.name()} Inc`
        AcessCompanyAndCreateCompany(newCompany)
        AcessPorts()

        cy.get('@SearchInput').type(port)
        cy.get('@SearchIcon').click()
        cy.wait('@getPorts')
        cy.contains('.list', port)

        cy.intercept('PUT', '**/Ports/**').as('putPorts')
        cy.get('.fa-pencil').as('Edit').click()
        // Necessário adicionar timer de 1s para renderização da tela
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)
        cy.get('[formcontrolname="name"]').clear()
        cy.get('[formcontrolname="name"]').type(newPort)
        cy.get(':nth-child(2) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${newCompany}{enter}`)
        cy.get(':nth-child(3) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type('Argentina{enter}')
        cy.contains('Salvar').click()
        cy.contains('Atualizado com sucesso!').should('be.visible')
        cy.wait('@putPorts').then((interception) => {
            expect(interception.response.statusCode).to.eq(204)
        })
        cy.get('.btn-close').first().click()
        cy.reload()
        cy.get('@SearchInput').type(newPort)
        cy.get('@SearchIcon').click()
        cy.wait('@getPorts')
        cy.contains('.list', newPort)

        // Delete the previous port
        cy.intercept('DELETE', '**/Ports/**').as('deletePorts')
        cy.get('.fa-trash-can').as('DeleteIcon').click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)
        cy.contains('.btn', 'Deletar').click()
        cy.contains('Removido com sucesso!').should('be.visible')
        cy.wait('@deletePorts').then((interception) => {
            expect(interception.response.statusCode).to.eq(204)
        })
        cy.wait('@getPorts')
        cy.get('@SearchInput').type(newPort)
        cy.get('@SearchIcon').click()
        cy.wait('@getCompanies')
        cy.contains(newPort).should('not.exist')
    });

})