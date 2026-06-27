package com.sgbankmanager.controller;

import com.sgbankmanager.dto.AccountRequestDTO;
import com.sgbankmanager.dto.AccountResponseDTO;
import com.sgbankmanager.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Endpoints REST pour la gestion des comptes bancaires.
 *
 * Pas de PUT/DELETE ici : un compte n'est ni modifié, ni supprimé directement
 * dans le périmètre de ce projet (sa suppression se fait uniquement en
 * cascade via DELETE /clients/{id}, ce qui est cohérent : on ne supprime pas
 * un compte bancaire sans supprimer le client correspondant).
 */
@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@Tag(name = "Comptes", description = "Gestion des comptes bancaires")
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    @Operation(summary = "Lister tous les comptes")
    public ResponseEntity<List<AccountResponseDTO>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un compte par son id")
    public ResponseEntity<AccountResponseDTO> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping
    @Operation(summary = "Créer un compte bancaire pour un client existant "
            + "(numéro de compte et IBAN générés automatiquement)")
    public ResponseEntity<AccountResponseDTO> createAccount(@Valid @RequestBody AccountRequestDTO requestDTO) {
        AccountResponseDTO created = accountService.createAccount(requestDTO);
        return ResponseEntity.created(URI.create("/accounts/" + created.getId())).body(created);
    }
}
