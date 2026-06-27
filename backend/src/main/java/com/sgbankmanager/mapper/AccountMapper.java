package com.sgbankmanager.mapper;

import com.sgbankmanager.dto.AccountResponseDTO;
import com.sgbankmanager.entity.Account;
import org.springframework.stereotype.Component;

/**
 * Conversion Entity -> DTO pour Account.
 *
 * Pas de toEntity() ici, volontairement : créer un Account demande de la
 * logique métier (vérifier que le client existe, qu'il n'a pas déjà de
 * compte, générer un numéro de compte et un IBAN uniques...). Ce n'est plus
 * du simple mapping, ça appartient à AccountService.
 */
@Component
public class AccountMapper {

    public AccountResponseDTO toResponseDTO(Account account) {
        return AccountResponseDTO.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .iban(account.getIban())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .clientId(account.getClient().getId())
                .clientFullName(account.getClient().getFirstName() + " " + account.getClient().getLastName())
                .build();
    }
}
