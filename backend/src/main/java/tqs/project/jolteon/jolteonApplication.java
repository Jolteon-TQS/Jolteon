package tqs.project.jolteon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class jolteonApplication {

	private static final Logger logger = LoggerFactory.getLogger(jolteonApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(jolteonApplication.class, args);
		logger.info("🚀 Jolteon application started successfully!");
	}

}