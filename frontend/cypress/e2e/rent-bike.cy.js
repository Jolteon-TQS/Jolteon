describe("test rent bike logic", () => {
  beforeEach(() => {
    // Reset the database before each test
    cy.request("POST", "http://localhost:8080/api/reset/db");
    cy.visit("http://localhost:5173/bikes");
  });

  function rentBikeFromStation(index = 0) {
    cy.get(`[data-cy="station-row-${index}"] [data-cy="rent-button-${index}"]`)
      .should("be.visible")
      .click();

    cy.get("[data-cy=confirm-rent-button]").should("be.visible").click();
  }

  function endTripAtStation(stationName = "New York") {
    cy.visit("http://localhost:5173");
    cy.get('[data-cy="end-spot-select"]')
      .should("be.visible")
      .select(stationName);

    cy.get('[data-cy="end-trip-button"]')
      .should("be.visible")
      .click();
  }

  function expectAvailableBikes(index, expected) {
    cy.get(`[data-cy="station-row-${index}"]`).should(
      "have.attr",
      "data-available-bikes",
      expected.toString()
    );
  }

  it("shows all stations and their number of bikes, in the correct order", () => {
    const stations = [
      { city: "New York", bikes: 3 },
      { city: "Los Angeles", bikes: 2 },
      { city: "London", bikes: 4 },
      { city: "Paris", bikes: 6 },
      { city: "Tokyo", bikes: 1 },
    ];

    stations.forEach(({ city, bikes }, index) => {
      cy.get(`[data-cy="station-row-${index}"]`)
        .should("have.attr", "data-city", city)
        .and("have.attr", "data-available-bikes", bikes.toString());
    });
  });

  it("allows renting a bike from the New York station", () => {
    rentBikeFromStation(0);
    expectAvailableBikes(0, 2);

    cy.visit("http://localhost:5173");

    cy.get('[data-cy="start-spot"]')
      .should("be.visible")
      .and("contain", "New York");
  });

  it("allows ending a trip at a selected station (New York)", () => {
    rentBikeFromStation(0);
    endTripAtStation("New York");

    cy.visit("http://localhost:5173/bikes");
    expectAvailableBikes(0, 3);
  });

  it("shows an error when trying to rent a bike with an already active renting", () => {
    rentBikeFromStation(0);

    rentBikeFromStation(1); // Attempt second rent

    cy.get("[data-cy=error-toast]")
      .should("contain", "User already has an active bike renting");
  });

  // it("allows defining a rental duration", () => {
  //   cy.get('[data-cy="duration-select"]')
  //     .should("be.visible")
  //     .select("30"); // Select 30 minutes

  //   rentBikeFromStation(0);

  //   cy.visit("http://localhost:5173");
  //   cy.get('[data-cy="remaining-time"]')
  //     .should("be.visible")
  //     .and("contain", "29 minutes remaining");

  //   cy.wait(60000);
  //   cy.reload();
  //   cy.get('[data-cy="remaining-time"]')
  //     .should("be.visible")
  //     .and("contain", "28 minutes remaining");
  // });

  // it("ends a trip automatically when the remaining duration reaches 0", () => {
  //   const now = new Date();
  //   const end = new Date(now.getTime() + 30 * 1000); // 30 seconds later

  //   cy.request({
  //     method: "POST",
  //     url: "http://localhost:8080/api/rentings",
  //     body: {
  //       user: { id: 1 },
  //       bike: { id: 10 },
  //       startSpot: { id: 6 },
  //       time: now.toISOString(),
  //       endTime: end.toISOString(),
  //     },
  //     headers: { "Content-Type": "application/json" },
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //     cy.visit("http://localhost:5173");

  //     cy.get("[data-cy=remaining-time]")
  //       .should("be.visible")
  // //       .and("contain", "less than a minute remaining");

  // //     cy.wait(35000); // wait for 35 seconds

  // //     cy.reload();

  // //     cy.get("[data-cy=active-trip]").should("not.exist");
  //   });
  // });

  it("should not allow viewing trip details without and active rental", () => {

    cy.visit("http://localhost:5173");

    cy.get('[data-cy="no-active-rental"]')
      .should("be.visible")
      .and("contain", "You don't have any active bike rentals at the moment.");
  });

  it("should not allow ending a trip at a station with its bike capacity at max", () => {
    rentBikeFromStation(0); // Rent a bike from New York

    cy.visit("http://localhost:5173");

    // Attempt to end the trip at Paris, which has max capacity (6 bikes)
    cy.get('[data-cy="end-spot-select"]')
      .should("be.visible")
      .select("Paris");

    cy.get('[data-cy="end-trip-button"]')
      .should("be.visible")
      .click();

    cy.get("[data-cy=error-toast]")
      .should("contain", "End station capacity at max, select another one.");
  });

  it("should not allow ending a trip without selecting first an end station", () => {
    rentBikeFromStation(4);

    cy.visit("http://localhost:5173");
    cy.get('[data-cy="end-trip-button"]')
      .should("be.visible")
      .and("be.disabled");
  });

  it("should not allow renting a bike from a station with no available bikes", () => {
    // Rent bike from Tokyo, which has only 1 bike
    rentBikeFromStation(4);
    // Finish trip at New York
    endTripAtStation("New York");
    // Try to rent again from Tokyo (which now has 0 bikes)
    cy.visit("http://localhost:5173/bikes");
    cy.get(`[data-cy="station-row-4"] [data-cy="rent-button-4"]`)
      .should("be.visible")
      .and("be.disabled");
  });
});
