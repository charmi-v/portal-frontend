/*
/// <reference types="cypress" />
*/
import 'cypress'

declare global {
  namespace Cypress {
    interface Chainable {
      login: (u: string, p: string) => void
    }
  }
}

Cypress.Commands.add('login', (username, password) => {
  console.log({ username, password })

  // // creating a session for user login
  // cy.session([username, password], () => {})
  // // Mocking the Keycloak redirection
  // cy.intercept('GET', '**/auth/*', (req) => {
  //   // Mocking the Keycloak login response
  //   req.reply((res) => {
  //     // Set any headers, status codes, or response body you want
  //     res.send({
  //       statusCode: 200,
  //       body: {
  //         access_token: 'mocked_access_token',
  //         refresh_token: 'mocked_refresh_token',
  //       },
  //     })
  //   })
  // }).as('keycloakLogin')
  // // Simulate successful login by setting local storage or cookies
  // cy.window().then((win) => {
  //   // Set mocked Keycloak tokens in local storage
  //   win.localStorage.setItem('keycloak.token', 'mocked_access_token')
  //   win.localStorage.setItem('keycloak.refreshToken', 'mocked_refresh_token')
  //   // win.localStorage.setItem('keycloak.authenticated', true)
  // })
})
