package tqs.project.jolteon.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import tqs.project.jolteon.services.DatabaseResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/reset")
public class ResetController {

    private final DatabaseResetService resetService;

    public ResetController(DatabaseResetService resetService) {
        this.resetService = resetService;
    }

    @PostMapping("/db")
    public ResponseEntity<String> resetDatabase() {
        try {
            resetService.resetDatabase();
            return ResponseEntity.ok("Database has been reset.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to reset database: " + e.getMessage());
        }
    }
}
