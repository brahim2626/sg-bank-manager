package com.sgbankmanager.repository;

import com.sgbankmanager.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Accès aux données pour l'entité {@link Client}.
 * JpaRepository fournit déjà le CRUD complet (findAll, findById, save, deleteById...).
 * Seules les requêtes spécifiques au métier sont ajoutées ici.
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByEmail(String email);

    boolean existsByEmail(String email);
}
