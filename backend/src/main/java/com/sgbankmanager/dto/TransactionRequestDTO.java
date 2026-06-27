package com.sgbankmanager.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Données envoyées pour un dépôt ou un retrait.
 *
 * Le type d'opération (DEPOSIT/WITHDRAWAL) n'est PAS un champ ici : il est
 * déterminé par l'endpoint appelé (/transactions/deposit ou /transactions/withdraw,
 * conformément au cahier des charges), pas par une valeur fournie par le client
 * de l'API. Ça évite un endpoint générique où un appelant pourrait se tromper
 * de type d'opération.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequestDTO {

    @NotNull(message = "L'identifiant du compte est obligatoire")
    private Long accountId;

    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être strictement positif")
    private BigDecimal amount;
}
