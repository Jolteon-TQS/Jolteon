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
});
