describe("Test Operation functions", () => {
  it("add-bike-successful", function () {
    cy.visit("localhost:5173/bikes");

    // wait for 1.0 seconds to ensure the page is fully loaded
    cy.wait(1000);
    // Find the element for Los Angeles and grab the number of bikes available
    cy.contains("li.list-row", "Los Angeles") // find the <li> with "Los Angeles"
      .find("div.text-xs") // find the element with the "7 bikes available" text
      .invoke("text") // get the text content
      .then((text) => {
        // extract the number from the text, e.g. "7 bikes available"
        const match = text.match(/(\d+) bikes available/);
        const bikesAvailable = match ? parseInt(match[1], 10) : 0;

        // store it as an alias for later use
        cy.wrap(bikesAvailable).as("bikesBefore");
      });

    // Add a new bike
    cy.visit("localhost:5173/operator");
    cy.get(".select").select("2");
    cy.get('[placeholder="Latitude"]').clear().type("34.052235");
    cy.get('[placeholder="Longitude"]').clear().type("-118.243683");
    cy.get(":nth-child(3) > .input").clear().type("60");
    cy.get(".space-y-6 > :nth-child(3) > .btn").click();

    // Check number of bikes in Los Angeles after adding a new bike
    cy.visit("localhost:5173/bikes");
    // wait for 2.5 seconds to ensure the page is fully loaded
    cy.wait(1000);
    cy.contains("li.list-row", "Los Angeles")
      .find("div.text-xs")
      .invoke("text")
      .then((text) => {
        const match = text.match(/(\d+) bikes available/);
        const bikesAfter = match ? parseInt(match[1], 10) : 0;

        // get the previously stored number
        cy.get("@bikesBefore").then((bikesBefore) => {
          expect(bikesAfter).to.eq(bikesBefore + 1);
        });
      });
  });

  it("add-bike-with-empty-fields", function () {
    cy.visit("localhost:5173/operator");

    // Attempt to add a bike with some empty fields
    cy.get(".select").select("2");
    cy.get('[placeholder="Latitude"]').clear();
    cy.get('[placeholder="Longitude"]').clear();
    cy.get(":nth-child(3) > .input").clear();

    // Check that button is disabled
    cy.get(".space-y-6 > :nth-child(3) > .btn").should("be.disabled");
  });

  it("add-bike-with-invalid-latitude", function () {
    cy.visit("localhost:5173/operator");

    // Attempt to add a bike with an invalid latitude
    cy.get(".select").select("2");
    cy.get('[placeholder="Latitude"]').clear().type("invalid_latitude");
    cy.get('[placeholder="Longitude"]').clear().type("-118.243683");
    cy.get(":nth-child(3) > .input").clear().type("60");

    // Check that button is disabled
    cy.get(".space-y-6 > :nth-child(3) > .btn").should("be.disabled");
  });
  it("add-bike-with-invalid-longitude", function () {
    cy.visit("localhost:5173/operator");

    // Attempt to add a bike with an invalid longitude
    cy.get(".select").select("2");
    cy.get('[placeholder="Latitude"]').clear().type("34.052235");
    cy.get('[placeholder="Longitude"]').clear().type("invalid_longitude");
    cy.get(":nth-child(3) > .input").clear().type("60");

    // Check that button is disabled
    cy.get(".space-y-6 > :nth-child(3) > .btn").should("be.disabled");
  });
  it("add-bike-with-invalid-battery", function () {
    cy.visit("localhost:5173/operator");

    // Attempt to add a bike with an invalid battery percentage
    cy.get(".select").select("2");
    cy.get('[placeholder="Latitude"]').clear().type("34.052235");
    cy.get('[placeholder="Longitude"]').clear().type("-118.243683");
    cy.get(":nth-child(3) > .input").clear().type("invalid_battery");

    // Check that button is disabled
    cy.get(".space-y-6 > :nth-child(3) > .btn").should("be.disabled");
  });

  /* ==== Test Created with Cypress Studio ==== */
  it("add-station-successful", function () {
    /* ==== Generated with Cypress Studio ==== */
    const lat = 40.6412;
    const long = -8.65362;
    const capacity = 2;

    cy.visit("localhost:5173/operator");
    cy.get('[placeholder="City *"]').clear().type("Aveiro");
    cy.get('[placeholder="Latitude *"]').clear().type(lat.toString());
    cy.get('[placeholder="Longitude *"]').clear().type(long.toString());
    cy.get('[placeholder="Capacity *"]').clear().type(capacity.toString());
    cy.get(".space-y-6 > :nth-child(5) > .btn").click();
    cy.get(":nth-child(6) > .btn").click();
    cy.get("tbody > :nth-child(6)").click();
    /* ==== End Cypress Studio ==== */

    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row)
        .find("td")
        .eq(1)
        .invoke("text")
        .then((city) => {
          if (city.trim() === "Aveiro") {
            // Capacity is in the 3rd <td> (index 2)
            cy.wrap($row)
              .find("td")
              .eq(2)
              .invoke("text")
              .then((capacityText) => {
                const capacityResult = parseInt(capacityText.trim(), 10);
                expect(capacityResult).to.equal(capacity);

                // Location is in the 4th <td> (index 3), format: "40.6412, -8.6536"
                cy.wrap($row)
                  .find("td")
                  .eq(3)
                  .invoke("text")
                  .then((locationText) => {
                    const [latStr, longStr] = locationText
                      .split(",")
                      .map((s) => s.trim());
                    const latResult = parseFloat(latStr);
                    const longResult = parseFloat(longStr);
                    expect(latResult).to.be.closeTo(lat, 0.0001);
                    expect(longResult).to.be.closeTo(long, 0.0001);
                  });
              });
          }
        });
    });
  });

  it("add-station-with-empty-fields", function () {
    cy.visit("localhost:5173/operator");

    // Attempt to add a station with some empty fields
    cy.get('[placeholder="City *"]').clear();
    cy.get('[placeholder="Latitude *"]').clear();
    cy.get('[placeholder="Longitude *"]').clear();
    cy.get('[placeholder="Capacity *"]').clear();

    // Check that button is disabled
    cy.get(".space-y-6 > :nth-child(5) > .btn").should("be.disabled");
  });

  it("add-station-with-invalid-latitude", function () {
    cy.visit("localhost:5173/operator");

    // Attempt to add a station with an invalid latitude
    cy.get('[placeholder="City *"]').clear().type("Aveiro");
    cy.get('[placeholder="Latitude *"]').clear().type("invalid_latitude");
    cy.get('[placeholder="Longitude *"]').clear().type("-8.65362");
    cy.get('[placeholder="Capacity *"]').clear().type("2");

    // Check that button is disabled
    cy.get(".space-y-6 > :nth-child(5) > .btn").should("be.disabled");
  });

  it("add-station-with-invalid-longitude", function () {
    cy.visit("localhost:5173/operator");

    // Attempt to add a station with an invalid longitude
    cy.get('[placeholder="City *"]').clear().type("Aveiro");
    cy.get('[placeholder="Latitude *"]').clear().type("40.6412");
    cy.get('[placeholder="Longitude *"]').clear().type("invalid_longitude");
    cy.get('[placeholder="Capacity *"]').clear("2");

    // Check that button is disabled
    cy.get(".space-y-6 > :nth-child(5) > .btn").should("be.disabled");
  });

  it("add-station-with-invalid-capacity", function () {
    cy.visit("localhost:5173/operator");

    // Attempt to add a station with an invalid capacity
    cy.get('[placeholder="City *"]').clear("Aveiro");
    cy.get('[placeholder="Latitude *"]').clear("40.6412");
    cy.get('[placeholder="Longitude *"]').clear("-8.65362");
    cy.get('[placeholder="Capacity *"]').clear("invalid_capacity");

    // Check that button is disabled
    cy.get(".space-y-6 > :nth-child(5) > .btn").should("be.disabled");
  });

  /* ==== Test Created with Cypress Studio ==== */
  it("edit-station-successful", function () {
    const lat = 50;
    const long = 10;
    const capacity = 3;
    const city = "Évora";

    /* ==== Generated with Cypress Studio ==== */
    cy.visit("localhost:5173/operator");
    cy.get(":nth-child(6) > .btn").click();
    cy.get(":nth-child(6) > .flex > .btn-info").click();
    cy.get(":nth-child(6) > :nth-child(3) > .input")
      .clear()
      .type(capacity.toString());
    cy.get(":nth-child(6) > :nth-child(2) > .input").clear().type(city);
    cy.get('[value="40.6412"]').clear().type(lat.toString());
    cy.get('[value="-8.65362"]').clear().type(long.toString());
    cy.get(".btn-success").click();
    /* ==== End Cypress Studio ==== */

    // Check that the station was updated correctly
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row)
        .find("td")
        .eq(1)
        .invoke("text")
        .then((cityText) => {
          if (cityText.trim() === city) {
            // Capacity is in the 3rd <td> (index 2)
            cy.wrap($row)
              .find("td")
              .eq(2)
              .invoke("text")
              .then((capacityText) => {
                const capacityResult = parseInt(capacityText.trim(), 10);
                expect(capacityResult).to.equal(capacity);

                // Location is in the 4th <td> (index 3), format: "50.0000, 10.0000"
                cy.wrap($row)
                  .find("td")
                  .eq(3)
                  .invoke("text")
                  .then((locationText) => {
                    const [latStr, longStr] = locationText
                      .split(",")
                      .map((s) => s.trim());
                    const latResult = parseFloat(latStr);
                    const longResult = parseFloat(longStr);
                    expect(latResult).to.be.closeTo(lat, 0.0001);
                    expect(longResult).to.be.closeTo(long, 0.0001);
                  });
              });
          }
        });
    });
  });

  /* ==== Test Created with Cypress Studio ==== */
  it("delete-station-successful", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit("localhost:5173/operator");
    cy.get(":nth-child(6) > .btn").click();
    cy.get(":nth-child(6) > .flex > .btn-error").click();
    cy.get(".modal-action > .btn").click();
    cy.get(":nth-child(6) > .btn").click();
    // Check that the station is no longer in the list
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row)
        .find("td")
        .eq(1)
        .invoke("text")
        .then((city) => {
          expect(city.trim()).not.to.equal("Aveiro");
        });
    });
    /* ==== End Cypress Studio ==== */
  });
});
