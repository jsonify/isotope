describe('Example Test', () => {
  it('should visit the app', () => {
    cy.visit('/');
    cy.contains('Isotope');
  });
});
