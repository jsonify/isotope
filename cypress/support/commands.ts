// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Example of a custom command:
// Cypress.Commands.add('login', (email, password) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      // Add types for custom commands here
      // login(email: string, password: string): Chainable<void>
    }
  }
}

export {};
