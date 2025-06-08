describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/bikes')
    cy.request('POST', 'http://localhost:5173/api/reset')
  })
})