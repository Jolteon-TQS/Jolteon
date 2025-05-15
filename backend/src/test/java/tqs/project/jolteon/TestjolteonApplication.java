package tqs.project.jolteon;

import org.springframework.boot.SpringApplication;

import tqs.project.jolteon.jolteonApplication;

public class TestjolteonApplication {

	public static void main(String[] args) {
		SpringApplication.from(jolteonApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
