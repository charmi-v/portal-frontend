/// <reference types="cypress" />

export {}
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login: (userType: string) => Chainable<Subject>
      snackbarAlert: (m: string) => Chainable<Subject>
    }
  }
}

Cypress.Commands.add('login', (usertype) => {
  // creating a session for user login
  cy.session(
    [usertype],
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
        { args: { usertype } },
        ({ usertype }) => {
          const currentUsername =
            usertype === 'admin'
              ? Cypress.env('admin').email
              : Cypress.env('user').email
          const currentPassword =
            usertype === 'admin'
              ? Cypress.env('admin').password
              : Cypress.env('user').password
          cy.get('#username').should('exist').type(currentUsername)
          cy.get('#password').type(currentPassword)
          cy.get('#kc-login').click() // Submit the Keycloak form
        }
      )
    },
    { cacheAcrossSpecs: true }
  )
})

Cypress.Commands.add('snackbarAlert', (text) => {
  cy.get('.MuiSnackbar-root')
    .should('be.visible')
    .then(() => {
      cy.get('.MuiSnackbarContent-root').should('contain', text)
      cy.wait(7000)
    })
    .should('not.exist')
})
