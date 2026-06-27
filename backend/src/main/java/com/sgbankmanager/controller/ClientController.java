package com.sgbankmanager.controller;

import com.sgbankmanager.dto.ClientRequestDTO;
import com.sgbankmanager.dto.ClientResponseDTO;
import com.sgbankmanager.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Endpoints REST pour la gestion des clients.
 *
 * Aucune logique métier ici : ce controller ne fait que déléguer à
 * {@link ClientService} et traduire le résultat en réponse HTTP. Toute
 * exception levée par le service (ResourceNotFoundException,
 * DuplicateResourceException...) remonte automatiquement jusqu'au
 * GlobalExceptionHandler - pas besoin de try/catch ici.
 */
@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@Tag(name = "Clients", description = "Gestion des clients de la banque")
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    @Operation(summary = "Lister tous les clients")
    public ResponseEntity<List<ClientResponseDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un client par son id")
    public ResponseEntity<ClientResponseDTO> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau client")
    public ResponseEntity<ClientResponseDTO> createClient(@Valid @RequestBody ClientRequestDTO requestDTO) {
        ClientResponseDTO created = clientService.createClient(requestDTO);
        // URI relative : suffisant pour ce projet. En production, on construirait
        // plutôt une URL absolue via ServletUriComponentsBuilder.fromCurrentRequest().
        return ResponseEntity.created(URI.create("/clients/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un client existant")
    public ResponseEntity<ClientResponseDTO> updateClient(
            @PathVariable Long id, @Valid @RequestBody ClientRequestDTO requestDTO) {
        return ResponseEntity.ok(clientService.updateClient(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un client (supprime aussi son compte et son historique)")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
