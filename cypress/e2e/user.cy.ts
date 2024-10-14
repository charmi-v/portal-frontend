// /// <reference types="cypress" />

// // setting the viewport for desktop view
// describe('Validate user management', { viewportWidth: 1500 }, () => {
//   const baseUrl = 'http://localhost:3001'
//   const userEmail = 'user@email.com'

//   // Intercept the Keycloak login request
//   beforeEach(() => {
//     cy.login('admin-user', 'password')
//   })

//   it('redirect to user management page using header navigation', () => {
//     cy.visit(baseUrl)
//       .get('.cx-avatar .MuiSvgIcon-root[data-testid="PersonOutlineIcon"]')
//       .click()
//       .get('.cx-menu a')
//       .contains('User Management')
//       .click()
//       .url()
//       .should('include', '/userManagement')
//       .get('#identity-management-id')
//       .should('exist')
//   })

//   it('redirects to the user detail page', () => {
//     cy.visit(`${baseUrl}/userManagement`)
//       .get('#identity-management-id')
//       .should('exist')
//       .get('.MuiCircularProgress-root')
//       .should('not.exist')

//     cy.get('#identity-management-id [data-testid="SearchIcon"]').click()

//     cy.get('input[placeholder="Enter email to search"]').type('charmi')

//     cy.contains(' .MuiDataGrid-row', userEmail)
//       .find('[data-field="details"] button')
//       .click()
//       .url()
//       .should('include', '/userdetails')
//   })

//   it('update the user details', () => {
//     // visit(`${baseUrl}/userdetails/${userId}`)
//     cy.get('.MuiSvgIcon-root[data-testid="ModeEditOutlineOutlinedIcon"]')
//       .click()
//       .get('.bpnListing li')
//       .then((elements) => {
//         if (elements.length > 1) {
//           cy.get('.MuiDialog-container')
//             .contains('123400000003CRH2')
//             .next('svg')
//             .click()
//         }
//       })
//       .get('input[name="bpn"]')
//       .type('123400000003CRH2{enter}')
//       .get('.bpnListing')
//       .find('li')
//       .should('have.length', 2)
//       .get('.MuiDialog-container .cx-dialog__actions button')
//       .should('have.text', 'Close')
//       .click()
//   })
// })
