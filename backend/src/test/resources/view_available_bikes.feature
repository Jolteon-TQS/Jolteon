Feature: View available bikes on map

  Scenario: User opens the map and sees nearby bikes
    Given the user has granted location access
    When they open the bike map
    Then they should see pins for nearby bikes with battery levels
