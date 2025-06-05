describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });

  /* ==== Test Created with Cypress Studio ==== */
  it("test", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit("localhost:5173/bikes");
    cy.get(":nth-child(3) > .flex-grow > .text-xs").click();
    /* ==== End Cypress Studio ==== */
  });
});
