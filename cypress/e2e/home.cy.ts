/// <reference types="cypress" />

describe('Validate authentication for home page', () => {
  beforeEach(() => {
    cy.login('user')
  })

  it('should visit home page after login', () => {
    cy.visit(Cypress.env('baseUrl'))
      .get('.copyright')
      .should('have.text', 'Copyright © Catena-X Automotive Network')
  })
})
