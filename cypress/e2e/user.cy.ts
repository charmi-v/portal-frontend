/// <reference types="cypress" />

// setting the viewport for desktop view
describe('Validate user management', { viewportWidth: 1500 }, () => {
  const baseUrl = Cypress.env('baseUrl')
  const userEmail = Cypress.env('user').email
  const userId = Cypress.env('user').id

  // Intercept the Keycloak login request
  beforeEach(() => {
    cy.login(Cypress.env('admin').email, Cypress.env('admin').password)
  })

  it('redirect to user management page using header navigation', () => {
    cy.visit(baseUrl)
      .get('.cx-avatar .MuiSvgIcon-root[data-testid="PersonOutlineIcon"]')
      .click()
      .get('.cx-menu a')
      .contains('User Management')
      .click()
      .url()
      .should('include', '/userManagement')
      .get('#identity-management-id')
      .should('exist')
  })

  it('redirects to the user detail page', () => {
    cy.visit(`${baseUrl}/userManagement`)
      .get('#identity-management-id')
      .should('exist')
      .get('.MuiCircularProgress-root')
      .should('not.exist')

    cy.wait(1000)
    cy.get('#identity-management-id [data-testid="SearchIcon"]').click()

    cy.get('input[placeholder="Enter email to search"]').type('charmi')

    cy.contains(' .MuiDataGrid-row', userEmail)
      .find('[data-field="details"] button')
      .click()
      .url()
      .should('include', '/userdetails')
  })

  it('update the user details', () => {
    cy.visit(`${baseUrl}/userdetails/${userId}`)
      .get('.MuiSvgIcon-root[data-testid="ModeEditOutlineOutlinedIcon"]')
      .click()
      .get('.bpnListing li')
      .then((elements) => {
        if (elements.length > 1) {
          const isExists = [...elements].some((e) => {
            return e.textContent?.trim() === Cypress.env('user').bpn1
          })

          if (isExists) {
            cy.get('.MuiDialog-container')
              .contains(Cypress.env('user').bpn1)
              .next('svg')
              .click()
          }
        }
      })
      .get('input[name="bpn"]')
      .type(`${Cypress.env('user').bpn1}{enter}`)
      .get('.bpnListing')
      .find('li')
      .should('have.length', 2)
      .get('.MuiDialog-container .cx-dialog__actions button')
      .should('have.text', 'Close')
      .click()
  })
})
