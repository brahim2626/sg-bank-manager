package com.sgbankmanager.dto;

import com.sgbankmanager.entity.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Données envoyées pour créer un compte.
 *
 * Volontairement minimal : ni le numéro de compte ni l'IBAN ne sont demandés
 * au client de l'API. Ce sont des identifiants sensibles générés par le
 * système (cf. AccountService) — on ne fait jamais confiance à l'appelant
 * pour des données de ce type.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequestDTO {

    @NotNull(message = "L'identifiant du client est obligatoire")
    private Long clientId;

    @NotNull(message = "Le type de compte est obligatoire")
    private AccountType accountType;
}
