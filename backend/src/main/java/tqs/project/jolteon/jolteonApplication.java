package tqs.project.jolteon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class jolteonApplication {

	public static void main(String[] args) {
		SpringApplication.run(jolteonApplication.class, args);
	}

}