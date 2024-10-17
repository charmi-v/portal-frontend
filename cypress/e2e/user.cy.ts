/// <reference types="cypress" />

const baseUrl = Cypress.env('baseUrl')
const userEmail = Cypress.env('user').email

describe('User Account', { viewportWidth: 1500 }, () => {
  beforeEach(() => {
    cy.login(Cypress.env('admin').email, Cypress.env('admin').password)
    cy.intercept(
      'POST',
      `${Cypress.env('backendUrl')}/api/administration/user/owncompany/users`,
      {
        fixture: 'newUser.json',
      }
    )
  })

  it('view company user accounts', () => {
    // redirect to user management page using navigation menu
    cy.visit(baseUrl)
      .get('.cx-avatar .MuiSvgIcon-root[data-testid="PersonOutlineIcon"]')
      .click()
      .get('.cx-menu a')
      .contains('User Management')
      .click()

    // validating the page url
    cy.url()
      .should('equal', `${baseUrl}/userManagement`)
      .get('#identity-management-id')
      .should('exist')
      .get('.MuiCircularProgress-root')
      .should('not.exist')

    // search the account & navigate to user details page
    cy.wait(1000)
    cy.get('#identity-management-id [data-testid="SearchIcon"]').click()
    cy.get('input[placeholder="Enter email to search"]').type('charmi')
    cy.contains(' .MuiDataGrid-row', userEmail)
      .find('[data-field="details"] button')
      .click()
      .url()
      .should('include', '/userdetails')
  })

  it('create a new user account (single user)', () => {
    cy.visit(`${baseUrl}/userManagement`)
      .get('#identity-management-id')
      .should('exist')
      .get('.MuiCircularProgress-root')
      .should('not.exist')

    cy.get('.MuiBox-root')
      .find('button')
      .contains('Add user', { matchCase: false })
      .click()

    cy.get('h2').contains('Add User Account')

    cy.get('button').contains('Confirm').as('formSubmit').should('be.disabled')
    cy.get('input[name="firstName"]').type('userFirstname')
    cy.get('input[name="lastName"]').type('userLastname')
    cy.get('input[name="email"]').type('user@example.com')

    cy.contains('label', 'CX User').find('input[type=checkbox]').check()

    cy.get('@formSubmit').should('not.be.disabled').click()

    cy.get('h4').should('have.text', 'User added successfully')
  })

  it('create a new user account (bulk user)', () => {
    cy.visit(`${baseUrl}/userManagement`)
      .get('#identity-management-id')
      .should('exist')
      .get('.MuiCircularProgress-root')
      .should('not.exist')

    cy.get('.MuiBox-root')
      .find('button')
      .contains('Add multiple users', { matchCase: false })
      .click()

    cy.get('button').contains('Confirm').as('Submit').should('be.disabled')
  })
})

describe('Modify User Account', () => {
  beforeEach(() => {
    cy.login(Cypress.env('admin').email, Cypress.env('admin').password)
  })

  const userId = Cypress.env('user').id

  it('summary page of user details', () => {
    cy.visit(`${baseUrl}/userdetails/${userId}`)
      .get('h6')
      .should('contain', userEmail)
  })

  it('manage user assigned bpn', () => {
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

  it('user permission - assigned portal role', () => {
    cy.visit(`${baseUrl}/userdetails/${userId}`)
      .get('button')
      .filter(':contains("Change Portal Role")')
      .click()

    cy.get('h2').should('have.text', 'Manage User Assigned Portal Role(s)')
    cy.get('button').contains('Confirm').as('SubmitBtn')

    cy.get('@SubmitBtn').should('be.disabled')
    cy.contains('label', 'App Developer').find('input[type="checkbox"]').click()
    cy.get('@SubmitBtn').should('not.be.disabled').click()

    cy.get('.MuiSnackbar-root')
      .should('be.visible')
      .then(() => {
        cy.get('.MuiSnackbarContent-root').should(
          'contain',
          'Portal Role(s) successfully updated.'
        )
        cy.wait(7000)
      })
      .should('not.exist')

    //reset the updated setting
    cy.get('button').filter(':contains("Change Portal Role")').click()
    cy.contains('label', 'App Developer').find('input[type="checkbox"]').click()
    cy.get('@SubmitBtn').should('not.be.disabled').click()
  })
})

describe('Technical User', () => {})

describe('Assign App Roles', () => {})
