package com.sgbankmanager.repository;

import com.sgbankmanager.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Accès aux données pour l'entité {@link Account}.
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByClientId(Long clientId);

    Optional<Account> findByAccountNumber(String accountNumber);

    boolean existsByIban(String iban);

    boolean existsByAccountNumber(String accountNumber);
}
