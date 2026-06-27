package com.sgbankmanager.mapper;

import com.sgbankmanager.dto.TransactionResponseDTO;
import com.sgbankmanager.entity.Account;
import com.sgbankmanager.entity.Transaction;
import org.springframework.stereotype.Component;

/**
 * Conversion Entity -> DTO pour Transaction.
 * Pas de toEntity() : une transaction est créée exclusivement par
 * TransactionService, en conséquence d'un dépôt ou d'un retrait validé.
 */
@Component
public class TransactionMapper {

    public TransactionResponseDTO toResponseDTO(Transaction transaction) {
        Account account = transaction.getAccount();
        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .transactionDate(transaction.getTransactionDate())
                .accountId(account.getId())
                .accountNumber(account.getAccountNumber())
                .newBalance(account.getBalance())
                .build();
    }
}
