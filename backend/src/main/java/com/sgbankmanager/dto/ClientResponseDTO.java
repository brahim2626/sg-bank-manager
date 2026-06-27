package com.sgbankmanager.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Données renvoyées au client HTTP pour un Client.
 * Immutable (Getter+Builder uniquement) : construit une seule fois par le
 * mapper, jamais modifié ensuite. On n'exclut pas grand-chose ici par rapport
 * à l'entité, mais le principe reste le même que pour Account/Transaction :
 * ne jamais exposer l'entité JPA brute (et ses relations lazy) dans l'API.
 */
@Getter
@Builder
public class ClientResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
}
