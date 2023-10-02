/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('scheduled events sections test', () => {
    beforeEach(() => {
        cy.guiLogin()
        cy.intercept('GET', '**/scheduled-events/**').as('getScheduledEvents')
        cy.contains('Operação').click()
        cy.contains('Eventos Programados').click()
        cy.wait('@getScheduledEvents')
    })

    it('register, edit and delete a scheduled event', () => {
        /**
         * Register a scheduled event
         */
        const scheduledEvent = `cy: ${faker.lorem.sentence(5)}`
        cy.createScheduledEvent(scheduledEvent)
        cy.get('[placeholder="Pesquisar..."]').as('SearchInput').type(scheduledEvent)
        cy.get('.fa-search').as('SearchIcon').click()
        cy.wait('@getScheduledEvents')
        cy.contains('.list', scheduledEvent)

        /**
         * Edit a scheduled event
         */
        cy.intercept('PUT', '**/scheduled-events/**').as('putScheduledEvents')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.get('.fa-pencil').as('Edit').click()
        cy.wait('@getScheduledEvents')
        const newScheduledEvent = `cy: ${faker.lorem.sentence(5)}`
        cy.get('[formcontrolname="name"]').clear()
        cy.get('[formcontrolname="name"]').type(newScheduledEvent)
        // Isso deve ser alterado no futuro!
        cy.get('[formcontrolname="startDate"]').clear()
        cy.get('[formcontrolname="startDate"]').type('0102/2098')

        cy.get('[formcontrolname="hoursMinutesStart"]').clear()
        cy.get('[formcontrolname="hoursMinutesStart"]').type('1200')

        // Isso deve ser alterado no futuro!
        cy.get('[formcontrolname="endDate"]').clear()
        cy.get('[formcontrolname="endDate"]').type('0202/2099')

        cy.get('[formcontrolname="hoursMinutesEnd"]').clear()
        cy.get('[formcontrolname="hoursMinutesEnd"]').type('1200')

        cy.get('[formcontrolname="colorDisplay"]').invoke('val', `${faker.color.rgb()}`).trigger('change')
        cy.get('[formcontrolname="description"]').type(`${faker.lorem.text()}`)

        cy.contains('Alterar').click()
        cy.contains('Atualizado com sucesso!').should('be.visible')
        cy.wait('@putScheduledEvents').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
        })
        cy.contains('Operação').click()
        cy.contains('Eventos Programados').click()
        cy.get('@SearchInput').type(newScheduledEvent)
        cy.get('@SearchIcon').click()
        cy.wait('@getScheduledEvents')
        cy.contains('.list', newScheduledEvent)

        /** 
        * Delete a scheduled event
        */
        cy.intercept('DELETE', '**/scheduled-events//**').as('deleteScheduledEvents')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.get('.fa-trash-can').as('DeleteIcon').click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.contains('.btn', 'Deletar').click()
        cy.contains('Removido com sucesso!').should('be.visible')
        cy.wait('@deleteScheduledEvents').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
        })
        cy.wait('@getScheduledEvents')
        cy.get('@SearchInput').type(newScheduledEvent)
        cy.get('@SearchIcon').click()
        cy.wait('@getScheduledEvents')
        cy.contains(newScheduledEvent).should('not.exist')
    })
})