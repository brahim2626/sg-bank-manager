package com.sgbankmanager.dto;

import com.sgbankmanager.entity.AccountType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * Données renvoyées pour un compte. On expose clientId (et un nom complet
 * pratique pour l'affichage) plutôt que l'entité Client entière : ça évite
 * tout risque de boucle infinie de sérialisation (Account -> Client -> Account...)
 * et tout déclenchement de lazy-loading inattendu hors transaction.
 */
@Getter
@Builder
public class AccountResponseDTO {

    private Long id;
    private String accountNumber;
    private String iban;
    private AccountType accountType;
    private BigDecimal balance;
    private Long clientId;
    private String clientFullName;
}
