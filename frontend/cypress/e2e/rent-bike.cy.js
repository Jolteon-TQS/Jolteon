describe("test rent bike logic", () => {
  beforeEach(() => {
    // Reset the database before each test
    cy.request("POST", "http://localhost:8080/api/reset/db");
    cy.visit("http://localhost:5173/bikes");
  });

  it("shows all stations in the correct order", () => {
    const stations = [
      { city: "New York", bikes: 3 },
      { city: "Los Angeles", bikes: 2 },
      { city: "London", bikes: 4 },
      { city: "Paris", bikes: 1 },
      { city: "Tokyo", bikes: 6 },
    ];

    stations.forEach(({ city, bikes }, index) => {
      cy.get(`[data-cy="station-row-${index}"]`)
        .should("have.attr", "data-city", city)
        .and("have.attr", "data-available-bikes", bikes.toString());
    });
  });

  it("allows renting a bike from the New York station", () => {
    cy.get('[data-cy="station-row-0"] [data-cy="rent-button-0"]')
      .should("be.visible")
      .click();

    cy.get("[data-cy=confirm-rent-button]").should("be.visible").click();

    cy.get('[data-cy="station-row-0"]').should(
      "have.attr",
      "data-available-bikes",
      "2",
    );

    cy.visit("http://localhost:5173");

    cy.get('[data-cy="start-spot"]')
      .should("be.visible")
      .and("contain", "New York");
  });

  it("allows ending a trip at a selected station (New York)", () => {
    // First, rent a bike from New York
    cy.get('[data-cy="station-row-0"] [data-cy="rent-button-0"]')
      .should("be.visible")
      .click();

    cy.get("[data-cy=confirm-rent-button]").should("be.visible").click();

    // Now, end the trip at New York
    cy.visit("http://localhost:5173");
    // Select New York as the end spot from the end spot dropdown
    cy.get('[data-cy="end-spot-select"]')
      .should("be.visible")
      .select("New York");
    cy.get('[data-cy="end-trip-button"]').should("be.visible").click();

    // Verify that the bike is returned to New York station
    cy.visit("http://localhost:5173/bikes");
    cy.get('[data-cy="station-row-0"]').should(
      "have.attr",
      "data-available-bikes",
      "3",
    );
  });
});
