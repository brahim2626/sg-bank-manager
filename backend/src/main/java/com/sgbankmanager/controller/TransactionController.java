package com.sgbankmanager.controller;

import com.sgbankmanager.dto.TransactionRequestDTO;
import com.sgbankmanager.dto.TransactionResponseDTO;
import com.sgbankmanager.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Endpoints REST pour les transactions (dépôt, retrait, historique).
 *
 * Le type d'opération n'est jamais un paramètre de requête : il découle de
 * l'endpoint appelé (/deposit ou /withdraw), conformément au cahier des
 * charges. Ça évite un endpoint générique où l'appelant choisirait le type
 * d'opération - source d'erreurs.
 *
 * Si /withdraw est appelé avec un montant qui rendrait le solde négatif,
 * TransactionService lève InsufficientBalanceException, qui remonte
 * automatiquement jusqu'au GlobalExceptionHandler (HTTP 422) - rien à gérer ici.
 */
@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Dépôts, retraits et historique des opérations")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Lister les transactions (toutes, ou filtrées par compte via ?accountId=)")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactions(
            @RequestParam(required = false) Long accountId) {
        List<TransactionResponseDTO> transactions = accountId != null
                ? transactionService.getTransactionsByAccount(accountId)
                : transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une transaction par son id")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PostMapping("/deposit")
    @Operation(summary = "Effectuer un dépôt sur un compte")
    public ResponseEntity<TransactionResponseDTO> deposit(@Valid @RequestBody TransactionRequestDTO requestDTO) {
        TransactionResponseDTO created = transactionService.deposit(requestDTO);
        return ResponseEntity.created(URI.create("/transactions/" + created.getId())).body(created);
    }

    @PostMapping("/withdraw")
    @Operation(summary = "Effectuer un retrait sur un compte (refusé si le solde devient négatif)")
    public ResponseEntity<TransactionResponseDTO> withdraw(@Valid @RequestBody TransactionRequestDTO requestDTO) {
        TransactionResponseDTO created = transactionService.withdraw(requestDTO);
        return ResponseEntity.created(URI.create("/transactions/" + created.getId())).body(created);
    }
}
