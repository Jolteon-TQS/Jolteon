package tqs.project.jolteon.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tqs.project.jolteon.services.ChargingSpotService;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@RestController
@RequestMapping("/api/chargingSpots")
public class ChargingSpotController {

    private final ChargingSpotService chargingSpotService;

    public ChargingSpotController(ChargingSpotService chargingSpotService) {
        this.chargingSpotService = chargingSpotService;
    }

    @Operation(summary = "Associate Bike with Charging Spot", description = "Associate an existing bike with a specific charging spot.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully associated the bike with the charging spot."),
            @ApiResponse(responseCode = "404", description = "Charging spot or bike not found."),
            @ApiResponse(responseCode = "400", description = "Invalid association request.")
    })
    @PostMapping("/{chargingSpotId}/bikes/{bikeId}")
    public ResponseEntity<String> associateBikeWithChargingSpot(
            @Parameter(description = "ID of the charging spot", required = true) @PathVariable Long chargingSpotId,
            @Parameter(description = "ID of the bike", required = true) @PathVariable Long bikeId) {
        chargingSpotService.addBikeToChargingSpot(chargingSpotId, bikeId);
        return ResponseEntity.ok("Bike successfully associated with Charging Spot.");
    }
}
