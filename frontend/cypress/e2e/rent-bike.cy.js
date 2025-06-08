describe('example to-do app', () => {
  beforeEach(() => {
    // Reset the database before each test
    cy.request('POST', 'http://localhost:5173/api/reset/db')
    cy.visit('http://localhost:5173/bikes')
  })

  // it('should display the bikes', () => {
  //   cy.get('.bike-item').should('have.length', 3)
  //   cy.get('.bike-item').first().contains('Bike 1')
  //   cy.get('.bike-item').last().contains('Bike 3')
  // })
})