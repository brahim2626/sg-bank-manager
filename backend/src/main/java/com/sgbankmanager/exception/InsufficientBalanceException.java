package com.sgbankmanager.exception;

/**
 * Levée lorsqu'un retrait rendrait le solde d'un compte négatif.
 * C'est la règle métier centrale du projet : un compte ne peut jamais
 * passer en négatif. Traduite en HTTP 422 (Unprocessable Entity) par le
 * {@link GlobalExceptionHandler} : la requête est syntaxiquement valide,
 * mais ne respecte pas une règle métier.
 */
public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(String message) {
        super(message);
    }
}
