package com.sgbankmanager.mapper;

import com.sgbankmanager.dto.ClientRequestDTO;
import com.sgbankmanager.dto.ClientResponseDTO;
import com.sgbankmanager.entity.Client;
import org.springframework.stereotype.Component;

/**
 * Conversion manuelle Entity <-> DTO pour Client.
 *
 * Pas de MapStruct ici : pour un projet de cette taille, du mapping manuel
 * reste plus simple à lire et à expliquer (pas de génération de code à
 * comprendre), au prix d'un peu plus de code répétitif. Sur un projet plus
 * gros, MapStruct deviendrait pertinent pour éviter cette répétition.
 */
@Component
public class ClientMapper {

    public Client toEntity(ClientRequestDTO dto) {
        return Client.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .build();
    }

    public ClientResponseDTO toResponseDTO(Client client) {
        return ClientResponseDTO.builder()
                .id(client.getId())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .createdAt(client.getCreatedAt())
                .build();
    }
}
