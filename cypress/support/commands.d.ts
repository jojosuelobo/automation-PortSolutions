// cypress/support/commands.d.ts

/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Logs into PortSolutions via the graphical user interface (GUI).
       *
       * @param username string - The credencials of the user you want to log in with
       * @param password string - The password of the user you want to log in with
       *
       * @example cy.guiLogin() // Logs into the app using the default admin email and password (defined as envs)
       * @example cy.guiLogin('jojosuelobo', 'senha123') // Logs into the app using the provided credentials
       */
      guiLogin(username?: string, password?: string): void | Cypress.Chainable<null>
  
      /**
       * Logs into PortSolutions via GUI **once**, and creates a session in this process
       * for further restoring. This way, no time is wasted when authentication is only a
       * test's pre-condition instead of its primary focus.
       *
       * The username is used as the session id, which means that if it changes, eg., when
       * logging in with a different user, a new session is created (via GUI), and saved for
       * further restoring.
       *
       * @param username string - The credencials of the user you want to log in with
       * @param password string - The password of the user you want to log in with
       *
       * @example cy.sessionLogin() // Logs into the app (or simply restores the session) using the default email and password (defined as envs)
       * @example cy.sessionLogin('jojosuelobo', 'senha123') // Logs into the app (or simply restores the session) using the provided credentials
       */
      sessionLogin(username?: string, password?: string): void | Cypress.Chainable<null>
    }
  }
  