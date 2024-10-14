/// <reference types="cypress" />

export {}
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login: (u: string, p: string) => Chainable<Subject>
    }
  }
}

Cypress.Commands.add('login', (username, password) => {
  // creating a session for user login
  cy.session(
    [username, password],
    () => {
      cy.visit(Cypress.env('baseUrl'))

      // Perform login on Keycloak login page
      cy.origin(Cypress.env('keycloak').centralUrl, () => {
        // Click the login button to be redirected to Keycloak
        cy.get('input[placeholder="Enter your company name"]').type(
          'CX-operator'
        ) // Update selector based on your app

        cy.get('li').find('div').contains('CX-Operator').click()
      })

      cy.origin(
        Cypress.env('keycloak').sharedUrl,
        { args: { username, password } },
        ({ username, password }) => {
          cy.get('#username').should('exist').type(username)
          cy.get('#password').type(password)
          cy.get('#kc-login').click() // Submit the Keycloak form
        }
      )
    },
    { cacheAcrossSpecs: true }
  )
})
