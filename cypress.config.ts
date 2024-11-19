import { defineConfig } from 'cypress'
import codeCoverageTask from '@cypress/code-coverage/task'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      codeCoverageTask(on, config)
      return config
    },
    env: {
      baseUrl: 'http://localhost:3001',
      backendUrl: 'https://portal-backend.example.org',
      user: {
        search: 'user',
        email: 'user@email.com',
        password: 'password',
        id: 'loggedin-user-id',
        bpn1: 'BPNL00000003CRH2',
        testid: '6a79b783-7152-4b59-9dba-277b0c749115',
        technicaltestuserid: '422bd504-1450-4fa7-a4bb-349462c70fd8',
      },
      // rename to newly created user id
      newUser: {
        id: 'loggedin-user-id-newuser-created',
        technicalUserId: 'technical-user-id',
      },
      activeApp: {
        id: 'active-user-app-id',
        name: 'Active app name',
      },
      admin: {
        email: 'cx-operator@email.com',
        password: 'password',
      },
      keycloak: {
        centralUrl: 'https://centralidp.example.org/auth',
        sharedUrl: 'https://sharedidp.example.org/auth',
      },
    },
  },
})
