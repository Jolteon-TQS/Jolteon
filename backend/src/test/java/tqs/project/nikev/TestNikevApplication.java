package tqs.project.nikev;

import org.springframework.boot.SpringApplication;

public class TestNikevApplication {

	public static void main(String[] args) {
		SpringApplication.from(NikevApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
