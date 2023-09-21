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
    const country = `cy: ${faker.lorem.word()}`
    const abbreviation = `cy: ${faker.lorem.word(3)}`
    cy.intercept('POST', '**/countries').as('postCountries')

    cy.contains('Novo').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('[formcontrolname="name"]').type(country)
    cy.get('[formcontrolname="abbreviation"]').type(abbreviation)
    cy.contains('Salvar').click()
    cy.contains('Cadastrado com sucesso!').should('be.visible')
    cy.get('.btn-close').first().click()
    cy.reload()
    cy.wait('@postCountries')

    cy.get('[placeholder="Pesquisar..."]').type(country)
    cy.get('.fa-search').click()
    cy.wait('@getCountries')
    cy.contains('.list', country)
  })

  it.only('Edit a country', () => {
    const country = `cy: ${faker.lorem.word()}`
    const abbreviation = `cy: ${faker.lorem.word(3)}`
    cy.intercept('POST', '**/countries').as('postCountries')
    cy.contains('Novo').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('[formcontrolname="name"]').type(country)
    cy.get('[formcontrolname="abbreviation"]').type(abbreviation)
    cy.contains('Salvar').click()
    cy.contains('Cadastrado com sucesso!').should('be.visible')
    cy.get('.btn-close').first().click()
    cy.reload()
    cy.wait('@postCountries')

    cy.get('[placeholder="Pesquisar..."]').type(country)
    cy.get('.fa-search').click()
    cy.wait('@getCountries')
    cy.contains('.list', country)

    cy.intercept('PUT', '**/countries/**').as('putCountries')
    const newCountry = `cy: ${faker.lorem.word()}`
    const newAbbreviation = `cy: ${faker.lorem.word(3)}`
    cy.get('.fa-pencil').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('[formcontrolname="name"]').clear()
    cy.get('[formcontrolname="name"]').type(newCountry)
    cy.get('[formcontrolname="abbreviation"]').clear()
    cy.get('[formcontrolname="abbreviation"]').type(newAbbreviation)
    cy.contains('Alterar').click()
    cy.wait('@putCountries').then((interception) => {
      expect(interception.response.statusCode).to.eq(204)
    })
    cy.contains('Atualizado com sucesso!').should('be.visible')
    cy.get('.btn-close').first().click()
    cy.reload()
    cy.wait('@getCountries')
    cy.get('[placeholder="Pesquisar..."]').type(newCountry)
    cy.get('.fa-search').click()
    cy.wait('@getCountries')
    cy.contains('.list', newCountry)
  })

  it('Delete a country', () => {
    const country = `cy: ${faker.lorem.word()}`
    const abbreviation = `cy: ${faker.lorem.word(3)}`
    cy.intercept('POST', '**/countries').as('postCountries')
    cy.contains('Novo').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('[formcontrolname="name"]').type(country)
    cy.get('[formcontrolname="abbreviation"]').type(abbreviation)
    cy.contains('Salvar').click()
    cy.contains('Cadastrado com sucesso!').should('be.visible')
    cy.get('.btn-close').first().click()
    cy.reload()
    cy.wait('@postCountries')

    cy.get('[placeholder="Pesquisar..."]').type(country)
    cy.get('.fa-search').click()
    cy.wait('@getCountries')
    cy.contains('.list', country)

    cy.intercept('DELETE', '**/countries/**').as('deleteCountries')
    cy.get('.fa-trash-can').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.contains('.btn', 'Deletar').click()
    cy.contains('Removido com sucesso!').should('be.visible')
    cy.wait('@deleteCountries').then((interception) => {
      expect(interception.response.statusCode).to.eq(204)
    })
    cy.wait('@getCountries')
    cy.get('[placeholder="Pesquisar..."]').type(country)
    cy.get('.fa-search').click()
    cy.wait('@getCountries')
    cy.contains(country).should('not.exist')
  })
})