/// <reference types="cypress" />

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
    cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(country, { delay: 0 })
    cy.get('.fa-search').as('SearchIcon').click()
    cy.get('.list').find('tr').should('have.length', 1).contains(country)
    cy.get('@SearchInput').clear()
    cy.get('@SearchInput').type('{selectall}Togo', { delay: 0 })
    cy.get('@SearchIcon').click()
    cy.get('.fa-pencil').as('Edit').click()
    cy.get('[formcontrolname="name"]', { timeout: 10000 }).should('be.visible').clear()
    cy.get('[formcontrolname="name"]').type('Togo', { delay: 0 })
    cy.get('[formcontrolname="abbreviation"]').clear()
    cy.get('[formcontrolname="abbreviation"]').type('TG', { delay: 0 })
    cy.contains('Alterar').click()
    cy.contains('Atualizado com sucesso!').should('be.visible')
    cy.get('.btn-close').first().click()
  })
})