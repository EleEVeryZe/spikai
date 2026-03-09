package com.example.usermodule;
import java.util.function.Function;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UsermoduleApplication {

	/*
	 * You need this main method or explicit <start-class>example.FunctionConfiguration</start-class>
	 * in the POM to ensure boot plug-in makes the correct entry
	 */
	public static void main(String[] args) {
		//SpringApplication.run(FunctionConfiguration.class, args);
		SpringApplication.run(UsermoduleApplication.class, args);
	}

	@Bean
	public Function<String, String> uppercase() {
		return value -> value.toUpperCase();
	}

	@Bean
	public Function<String, String> reverse() {
		return value -> new StringBuilder(value).reverse().toString();
	}	

	@Bean
	public Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> router() {
		return request -> {
			String path = request.getPath();
			String payload = request.getBody();
			String result;

			if (path.contains("/uppercase")) {
				result = uppercase().apply(payload);
			} else if (path.contains("/reverse")) {
				result = reverse().apply(payload);
			} else {
				return new APIGatewayProxyResponseEvent().withStatusCode(404);
			}

			return new APIGatewayProxyResponseEvent()
					.withStatusCode(200)
					.withBody(result);
		};
	}
}
