package com.sgbankmanager.service;

import com.sgbankmanager.dto.AccountRequestDTO;
import com.sgbankmanager.dto.AccountResponseDTO;
import com.sgbankmanager.entity.Account;
import com.sgbankmanager.entity.Client;
import com.sgbankmanager.exception.DuplicateResourceException;
import com.sgbankmanager.exception.ResourceNotFoundException;
import com.sgbankmanager.mapper.AccountMapper;
import com.sgbankmanager.repository.AccountRepository;
import com.sgbankmanager.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;

/**
 * Logique métier liée aux comptes bancaires.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int ACCOUNT_NUMBER_LENGTH = 8;
    private static final int IBAN_DIGITS_LENGTH = 25; // "FR" + 25 chiffres = 27 caractères

    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;
    private final AccountMapper accountMapper;

    public List<AccountResponseDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(accountMapper::toResponseDTO)
                .toList();
    }

    public AccountResponseDTO getAccountById(Long id) {
        return accountMapper.toResponseDTO(findAccountOrThrow(id));
    }

    @Transactional
    public AccountResponseDTO createAccount(AccountRequestDTO requestDTO) {
        Client client = clientRepository.findById(requestDTO.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Client introuvable avec l'id : " + requestDTO.getClientId()));

        // Relation Client <-> Account en OneToOne (cf. étape 1) : un client ne
        // peut avoir qu'un seul compte. On vérifie explicitement via le
        // repository plutôt que client.getAccount() pour ne pas dépendre de
        // l'état du cache de premier niveau / du lazy-loading.
        if (accountRepository.findByClientId(client.getId()).isPresent()) {
            throw new DuplicateResourceException(
                    "Le client " + client.getId() + " possède déjà un compte bancaire");
        }

        Account account = Account.builder()
                .accountNumber(generateUniqueAccountNumber())
                .iban(generateUniqueIban())
                .accountType(requestDTO.getAccountType())
                .balance(BigDecimal.ZERO)
                .client(client)
                .build();

        Account saved = accountRepository.save(account);
        return accountMapper.toResponseDTO(saved);
    }

    private Account findAccountOrThrow(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte introuvable avec l'id : " + id));
    }

    private String generateUniqueAccountNumber() {
        String candidate;
        do {
            candidate = String.format("%0" + ACCOUNT_NUMBER_LENGTH + "d",
                    RANDOM.nextInt((int) Math.pow(10, ACCOUNT_NUMBER_LENGTH)));
        } while (accountRepository.existsByAccountNumber(candidate));
        return candidate;
    }

    /**
     * Génère un IBAN français FICTIF, à but de démonstration uniquement.
     *
     * Structure respectée : "FR" + 25 chiffres = 27 caractères, qui est la
     * longueur réelle d'un IBAN français. En revanche, un IBAN réel s'appuie
     * sur une clé de contrôle calculée selon la norme ISO 13616 (algorithme
     * MOD-97, ISO 7064) - ce calcul est hors périmètre pour ce mini-projet.
     * Dans un vrai projet, on s'appuierait sur une librairie dédiée (ex. iban4j)
     * ou sur le système bancaire réel, qui attribue les IBAN.
     */
    private String generateUniqueIban() {
        String candidate;
        do {
            StringBuilder digits = new StringBuilder(IBAN_DIGITS_LENGTH);
            for (int i = 0; i < IBAN_DIGITS_LENGTH; i++) {
                digits.append(RANDOM.nextInt(10));
            }
            candidate = "FR" + digits;
        } while (accountRepository.existsByIban(candidate));
        return candidate;
    }
}
