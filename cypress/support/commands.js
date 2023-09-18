Cypress.Commands.add('guiLogin', (
  username = Cypress.env('LOGIN'),
  password = Cypress.env('PASSWORD')
) => {
  cy.visit('/login')
  cy.get('[formcontrolname="login"]').type(username)
  cy.get('[formcontrolname="password"]').type(password)
  cy.get('[name="submit"]').click()
})