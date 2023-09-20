/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('countries sections test', () => {
    beforeEach(() => {
        cy.guiLogin()
        cy.intercept('GET', '**/countries/**').as('getCountries')
        cy.contains('Administrar').click()
        cy.contains('Países').click()
        cy.wait('@getCountries')
    })

    it('register a new country', () => {
        const country = `cy: ${faker.address.country()}` 
        cy.intercept('POST', '**/countries').as('postCountries')

        cy.contains('Novo').click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.get('[formcontrolname="name"]').type(country)
        cy.get('[formcontrolname="abbreviation"]').type('CY')
        cy.contains('Salvar').click()
        cy.wait('@postCountries')

        cy.get('[placeholder="Pesquisar..."]').type(country)
        cy.get('.fa-search').click()
        cy.wait('@getCountries')
        cy.contains('.list', country)
    });
})