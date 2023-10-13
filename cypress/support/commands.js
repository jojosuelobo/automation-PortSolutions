import { faker } from '@faker-js/faker'

Cypress.Commands.add('guiLogin', (
  username = Cypress.env('LOGIN'),
  password = Cypress.env('PASSWORD')
) => {
  cy.visit('/login')
  cy.get('[formcontrolname="login"]').type(username, { delay: 0 })
  cy.get('[formcontrolname="password"]').type(password, { delay: 0 })
  cy.get('[name="submit"]').click()
})

Cypress.Commands.add('sessionLogin', (
  username = Cypress.env('LOGIN'),
  password = Cypress.env('PASSWORD')
) => {
  const login = () => cy.guiLogin(username, password)
  cy.session(username, login)
})

Cypress.Commands.add('createCompany', (
  company = `${faker.company.name()}`
) => {
  cy.contains('Novo').click()
  cy.wait(500)
  cy.get('[formcontrolname="name"]').type(company, { delay: 0 })
  cy.contains('button', 'Salvar').click()
  //cy.contains('Cadastrado com sucesso!').should('be.visible')
  //cy.get(':nth-child(3) > lg-toast > .toast > .toast-header > .btn-close')
  cy.get('#staticBackdrop > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').as('Fechar').click()
})

Cypress.Commands.add('createPort', (
  port = `Porto ${faker.location.city()}`,
  company = `${faker.company.name()}`,
  country = 'Brasil'
) => {
  cy.contains('Novo').click()
  cy.wait(500)
  cy.get('[formcontrolname="name"]').type(port, { delay: 0 })
  cy.get(':nth-child(2) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${company}{enter}`, { delay: 0 })
  cy.get(':nth-child(3) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${country}{enter}`, { delay: 0 })
  cy.contains('Salvar').click()
  //cy.get(':nth-child(2) > lg-toast > .toast > .toast-header > .btn-close').click()
  cy.get('@Fechar').click()
})

Cypress.Commands.add('createTerminal', (
  terminal = `Terminal ${(faker.lorem.sentence(3))}`,
  port = `Porto ${faker.location.city()}`,
) => {
  cy.contains('Novo').click()
  cy.wait(500)
  cy.get('[formcontrolname="name"]').type(terminal, { delay: 0 })
  cy.get(':nth-child(2) > .col-sm-10 > lg-select > .ng-select-searchable > .ng-select-container').type(`${port}{enter}`, { delay: 0 })
  cy.contains('Salvar').click()
  //cy.contains('Cadastrado com sucesso!').should('be.visible')
  cy.get('#staticBackdrop > .modal-dialog > .modal-content > .position-absolute > .btn-close')
  cy.get('@Fechar').click()
})

Cypress.Commands.add('createScheduledEvent', (
  scheduledEvent = `${faker.lorem.sentence(5)}`,
  status = null
) => {
  if(status === null){
    status = ['Agendado', 'Cancelado', 'Concluído']
    const maintenance = status[(Math.floor(Math.random() * maintenance.length))]
  }

  cy.intercept('POST', '**/scheduled-events').as('postScheduledEvents')
  cy.contains('Novo').click()
  cy.get('[formcontrolname="name"]').type(scheduledEvent)
  // Isso deve ser alterado no futuro!
  cy.get('[formcontrolname="startDate"]').type('0101/2098')
  cy.get('[formcontrolname="hoursMinutesStart"]').type('0000')
  cy.get('[formcontrolname="endDate"]').type('0201/2099')
  cy.get('[formcontrolname="hoursMinutesEnd"]').type('0000')
  cy.get('lg-select').each((select) => {
    cy.wrap(select).type('{enter}')
  })
  cy.get('[formcontrolname="colorDisplay"]').invoke('val', `${faker.color.rgb()}`).trigger('change')
  cy.get('[formcontrolname="description"]').type(`${faker.lorem.text()}`)
  cy.contains('Salvar').click()
  cy.contains('Cadastrado com sucesso!').should('be.visible')
  cy.wait('@postScheduledEvents').then((interception) => {
    expect(interception.response.statusCode).to.eq(200)
  })
  cy.get('.btn-close').first().click()
  cy.contains('Operação').click()
  cy.contains('Eventos Programados').click()
})