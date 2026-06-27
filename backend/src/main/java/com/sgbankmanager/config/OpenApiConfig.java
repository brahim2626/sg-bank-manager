package com.sgbankmanager.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration de la documentation OpenAPI (Swagger).
 *
 * Springdoc génère automatiquement la spécification à partir des
 * annotations Spring MVC (@RestController, @RequestMapping, DTO...).
 * Cette classe se contente d'enrichir les métadonnées générales de l'API.
 *
 * Documentation disponible une fois l'application démarrée sur :
 *  - JSON  : http://localhost:8080/api-docs
 *  - UI    : http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI sgBankManagerOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("SG Bank Manager API")
                        .description("API REST de gestion de clients, de comptes bancaires "
                                + "et de transactions (dépôts / retraits).")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("SG Bank Manager")
                                .email("contact@sgbankmanager.local"))
                        .license(new License()
                                .name("Projet de démonstration - usage pédagogique")));
    }
}
