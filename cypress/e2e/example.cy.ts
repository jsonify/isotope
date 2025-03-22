describe('Example Test', () => {
  it('should visit the app and display the main heading', () => {
    cy.visit('/');
    cy.contains('h1', 'Periodic Table Progression');
  });
});
