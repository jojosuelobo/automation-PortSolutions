/// <reference types="cypress" />
import { faker } from '@faker-js/faker/locale/pt_BR'

describe('countries sections test', () => {
  beforeEach(() => {
    cy.guiLogin()
    cy.intercept('GET', '**/countries/**').as('getCountries')
    cy.contains('Administrar').click()
    cy.contains('Países').click()
    cy.wait('@getCountries')
  })

  it('Navegation on Country page', () => {
    const country = 'Noruega'
    cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(country)
    cy.get('.fa-search').as('SearchIcon').click()
    cy.wait('@getCountries')
    cy.contains('.list', country)

    cy.get('@SearchInput').clear()
    cy.get('@SearchInput').type('TOGO')
    cy.get('@SearchIcon').click()
    cy.wait('@getCountries')
    cy.intercept('PUT', '**/countries/**').as('putCountries')
    cy.get('.fa-pencil').as('Edit').click()
    // Necessário adicionar timer de 1s para renderização da tela
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('[formcontrolname="name"]').type('o')
    cy.get('[formcontrolname="abbreviation"]').clear()
    cy.get('[formcontrolname="abbreviation"]').type('TG')
    cy.contains('Alterar').click()
    cy.wait('@putCountries').then((interception) => {
      expect(interception.response.statusCode).to.eq(204)
    })
    cy.contains('Atualizado com sucesso!').should('be.visible')
    cy.get('.btn-close').first().click()
  })
})