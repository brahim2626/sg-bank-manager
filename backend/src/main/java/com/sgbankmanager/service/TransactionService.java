package com.sgbankmanager.service;

import com.sgbankmanager.dto.TransactionRequestDTO;
import com.sgbankmanager.dto.TransactionResponseDTO;
import com.sgbankmanager.entity.Account;
import com.sgbankmanager.entity.Transaction;
import com.sgbankmanager.entity.TransactionType;
import com.sgbankmanager.exception.InsufficientBalanceException;
import com.sgbankmanager.exception.ResourceNotFoundException;
import com.sgbankmanager.mapper.TransactionMapper;
import com.sgbankmanager.repository.AccountRepository;
import com.sgbankmanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Logique métier des transactions : dépôt, retrait, historique.
 *
 * Règle métier centrale du projet : un retrait ne peut JAMAIS rendre le
 * solde d'un compte négatif (vérifiée dans withdraw()).
 *
 * @Transactional sur deposit()/withdraw() : chaque opération touche DEUX
 * choses qui doivent rester cohérentes ensemble - le solde du compte ET
 * l'enregistrement de la transaction. Si l'une des deux écritures échouait
 * sans transaction englobante, on pourrait se retrouver avec un solde modifié
 * mais aucune trace de l'opération (ou l'inverse). La transaction garantit
 * que les deux réussissent, ou qu'aucune n'est appliquée (rollback).
 *
 * Limite connue, assumée pour ce mini-projet : en cas d'accès concurrents
 * (deux retraits simultanés sur le même compte), il existe un risque de
 * "race condition" sur la lecture du solde. Dans un vrai projet bancaire, on
 * ajouterait un verrou optimiste (@Version sur Account) ou pessimiste
 * (SELECT ... FOR UPDATE) pour s'en protéger.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final TransactionMapper transactionMapper;

    public List<TransactionResponseDTO> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc().stream()
                .map(transactionMapper::toResponseDTO)
                .toList();
    }

    public List<TransactionResponseDTO> getTransactionsByAccount(Long accountId) {
        // On vérifie d'abord que le compte existe, pour renvoyer une 404 claire
        // plutôt qu'une liste vide ambiguë (compte inexistant vs compte sans historique).
        findAccountOrThrow(accountId);
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId).stream()
                .map(transactionMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public TransactionResponseDTO deposit(TransactionRequestDTO requestDTO) {
        Account account = findAccountOrThrow(requestDTO.getAccountId());

        account.setBalance(account.getBalance().add(requestDTO.getAmount()));
        // Pas de accountRepository.save(account) explicite : `account` est managé
        // par JPA dans cette transaction, le dirty checking suffit (même principe
        // que dans ClientService.updateClient).

        Transaction transaction = Transaction.builder()
                .type(TransactionType.DEPOSIT)
                .amount(requestDTO.getAmount())
                .account(account)
                .build();

        return transactionMapper.toResponseDTO(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponseDTO withdraw(TransactionRequestDTO requestDTO) {
        Account account = findAccountOrThrow(requestDTO.getAccountId());

        BigDecimal newBalance = account.getBalance().subtract(requestDTO.getAmount());
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new InsufficientBalanceException(
                    "Solde insuffisant sur le compte " + account.getAccountNumber()
                            + " (solde actuel : " + account.getBalance()
                            + ", retrait demandé : " + requestDTO.getAmount() + ")");
        }
        account.setBalance(newBalance);

        Transaction transaction = Transaction.builder()
                .type(TransactionType.WITHDRAWAL)
                .amount(requestDTO.getAmount())
                .account(account)
                .build();

        return transactionMapper.toResponseDTO(transactionRepository.save(transaction));
    }

    private Account findAccountOrThrow(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte introuvable avec l'id : " + accountId));
    }
}
