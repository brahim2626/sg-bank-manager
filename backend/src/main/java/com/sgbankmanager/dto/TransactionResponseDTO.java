package com.sgbankmanager.dto;

import com.sgbankmanager.entity.TransactionType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Données renvoyées pour une transaction.
 *
 * On inclut newBalance (le solde du compte APRÈS l'opération) : c'est un
 * petit confort pour le futur frontend, qui peut ainsi mettre à jour
 * l'affichage du solde sans refaire un appel séparé vers /accounts/{id}.
 */
@Getter
@Builder
public class TransactionResponseDTO {

    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private Long accountId;
    private String accountNumber;
    private BigDecimal newBalance;
}
