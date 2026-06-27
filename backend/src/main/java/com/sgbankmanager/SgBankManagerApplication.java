package com.sgbankmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Point d'entrée de l'application SG Bank Manager.
 *
 * Application Spring Boot exposant une API REST pour la gestion
 * de clients, de comptes bancaires et de transactions (dépôts/retraits).
 */
@SpringBootApplication
public class SgBankManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SgBankManagerApplication.class, args);
    }
}
