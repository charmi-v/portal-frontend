/// <reference types="cypress" />

describe('Validate authentication for home page', () => {
  beforeEach(() => {
    cy.login(Cypress.env('user').email, Cypress.env('user').password)
  })

  it('should visit home page after login', () => {
    cy.visit(Cypress.env('baseUrl'))
      .get('.copyright')
      .should('have.text', 'Copyright © Catena-X Automotive Network')
  })
})
