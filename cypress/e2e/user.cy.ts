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
    cy.intercept(
      'POST',
      `${Cypress.env('backendUrl')}/api/administration/user/owncompany/usersfile`,
      {
        fixture: 'newUserMultiple.json',
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

  it.only('create a new user account (bulk user)', () => {
    cy.visit(`${baseUrl}/userManagement`)
      .get('#identity-management-id')
      .should('exist')
      .get('.MuiCircularProgress-root')
      .should('not.exist')

    cy.get('.MuiBox-root')
      .find('button')
      .contains('Add multiple users', { matchCase: false })
      .click()

    // Step1: validate template download & read the file
    cy.get('button').contains('Download template').click()
    cy.readFile('cypress/downloads/user-bulk-load.csv')

    // Step2: validate help redirect link
    cy.get('.secondStep a')
      .should('have.text', 'Guide on how to fill the template')
      .should('have.attr', 'target', '_blank')
      .should(
        'have.attr',
        'href',
        '/documentation/?path=user%2F03.+User+Management%2F01.+User+Account%2F04.+Create+new+user+account+%28bulk%29.md'
      )
      .then((link) => {
        cy.request(link.prop('href')).its('status').should('eq', 200)
      })

    cy.get('button').contains('Confirm').as('SubmitBtn').should('be.disabled')

    // Step3: validate file upload
    cy.get('input[type=file]').as('fileInput')
    cy.get('.cx-drop__area').as('fileDroparea')
    cy.get('a').contains('browse files').as('fileBrowse')

    // input is invisible, so we need to skip Cypress UI checks
    cy.get('@fileInput').selectFile('cypress/docs/test.txt', { force: true })
    cy.get('.MuiAlert-message').contains('File type must be .csv')
    cy.get('@SubmitBtn').should('be.disabled')

    // use Cypress’ abilty to handle dropzones
    cy.get('@fileDroparea').selectFile('cypress/docs/test.csv', {
      action: 'drag-drop',
    })
    cy.snackbarAlert(
      'Bulk Upload list format wrong. Missing or incorrect header line. Recheck the download file to retrieve the expected format'
    )
    cy.get('@SubmitBtn').should('be.disabled')
    cy.get('@fileBrowse').should('have.css', 'pointer-events', 'none')
    cy.get('[data-testid="DeleteOutlineIcon"]').click()

    // make our input visible by invoking a jQuery function to it
    cy.get('@fileInput').selectFile('cypress/docs/user-bulk-load.csv', {
      force: true,
    })
    cy.get('@fileBrowse').should('have.css', 'pointer-events', 'none')
    cy.get('@SubmitBtn').should('not.be.disabled').click()

    cy.get('.documentMain')
      .first()
      .within(() => {
        cy.contains('user-bulk-load.csv')
      })
    cy.get('.documentMain')
      .eq(1)
      .within(() => {
        cy.contains('1')
        cy.contains('users to be uploaded')
      })

    cy.contains('label', 'CX User').find('input[type=checkbox]').check()
    cy.get('@SubmitBtn').should('not.be.disabled').click()

    //success response
    cy.get('.userDetailsMain').within(() => {
      cy.contains('1')
      cy.contains('Users successfully uploaded')
    })

    //TODO: validate error response
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
