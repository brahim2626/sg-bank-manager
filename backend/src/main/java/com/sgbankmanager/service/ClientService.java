package com.sgbankmanager.service;

import com.sgbankmanager.dto.ClientRequestDTO;
import com.sgbankmanager.dto.ClientResponseDTO;
import com.sgbankmanager.entity.Client;
import com.sgbankmanager.exception.DuplicateResourceException;
import com.sgbankmanager.exception.ResourceNotFoundException;
import com.sgbankmanager.mapper.ClientMapper;
import com.sgbankmanager.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Logique métier liée aux clients. Aucune logique métier ne doit se trouver
 * dans le controller (à venir à l'étape 3) : il ne fera qu'appeler ce service
 * et traduire le résultat en réponse HTTP.
 *
 * @RequiredArgsConstructor (Lombok) génère le constructeur pour les champs
 * `final` ci-dessous : c'est de l'injection par constructeur, pas par
 * @Autowired sur les champs. Avantages : les dépendances sont immuables,
 * visibles dans la signature du constructeur, et donc facilement injectables
 * par un mock dans un test unitaire.
 *
 * @Transactional(readOnly = true) au niveau classe : la plupart des méthodes
 * sont des lectures. readOnly=true permet à Hibernate de désactiver le dirty
 * checking sur ces méthodes (légère optimisation) et documente l'intention.
 * Les méthodes d'écriture surchargent explicitement avec @Transactional.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    public List<ClientResponseDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(clientMapper::toResponseDTO)
                .toList();
    }

    public ClientResponseDTO getClientById(Long id) {
        return clientMapper.toResponseDTO(findClientOrThrow(id));
    }

    @Transactional
    public ClientResponseDTO createClient(ClientRequestDTO requestDTO) {
        if (clientRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateResourceException(
                    "Un client existe déjà avec l'email : " + requestDTO.getEmail());
        }

        Client client = clientMapper.toEntity(requestDTO);
        Client saved = clientRepository.save(client);
        return clientMapper.toResponseDTO(saved);
    }

    @Transactional
    public ClientResponseDTO updateClient(Long id, ClientRequestDTO requestDTO) {
        Client client = findClientOrThrow(id);

        boolean emailChanged = !client.getEmail().equalsIgnoreCase(requestDTO.getEmail());
        if (emailChanged && clientRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateResourceException(
                    "Un client existe déjà avec l'email : " + requestDTO.getEmail());
        }

        client.setFirstName(requestDTO.getFirstName());
        client.setLastName(requestDTO.getLastName());
        client.setEmail(requestDTO.getEmail());
        client.setPhone(requestDTO.getPhone());

        // Pas d'appel explicite à clientRepository.save(client) : `client` est une
        // entité "managée" par le contexte de persistance JPA (récupérée via
        // findById dans CETTE même transaction). Hibernate détecte les
        // changements de champs (dirty checking) et génère l'UPDATE SQL
        // automatiquement au commit de la transaction.
        return clientMapper.toResponseDTO(client);
    }

    @Transactional
    public void deleteClient(Long id) {
        Client client = findClientOrThrow(id);
        // cascade = CascadeType.ALL + orphanRemoval sur Client.account :
        // supprimer le client supprime aussi son compte ET l'historique de
        // transactions associé. Comportement assumé pour ce mini-projet.
        clientRepository.delete(client);
    }

    private Client findClientOrThrow(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id : " + id));
    }
}
