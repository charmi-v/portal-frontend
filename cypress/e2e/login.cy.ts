/*
/// <reference types="cypress" />
*/

describe('Validate authentication for home page', () => {
  // Intercept the Keycloak login request
  beforeEach(() => {
    // Visit your app's login page or the page that triggers the Keycloak login

    cy.visit('http://localhost:3001')

    // Perform login on Keycloak login page
    cy.origin(
      'https://centralidp.example.com/auth/realms/CX-Central/protocol/openid-connect/auth',
      () => {
        // Click the login button to be redirected to Keycloak
        cy.get('input[placeholder="Enter your company name"]').type(
          'CX-operator'
        ) // Update selector based on your app

        cy.get('li').find('div').contains('CX-Operator').click()
      }
    )

    cy.origin(
      'https://sharedidp.example.com/auth/realms/CX-Operator/protocol/openid-connect/auth',
      () => {
        cy.get('#username').type('charmi@smartsensesolutionsss.com')
        cy.get('#password').type('123456789')
        cy.get('#kc-login').click() // Submit the Keycloak form
      }
    )
  })

  it('should visit home page after login', () => {
    // Verify that the login was successful by checking a logged-in element
    cy.get('.copyright').should(
      'have.text',
      'Copyright © Catena-X Automotive Network'
    ) // Ensure there's a logout button or some indicator of being logged in
  })
})
