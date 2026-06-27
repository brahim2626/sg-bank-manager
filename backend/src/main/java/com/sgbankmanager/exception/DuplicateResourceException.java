package com.sgbankmanager.exception;

/**
 * Levée en cas de conflit avec une contrainte d'unicité métier
 * (ex : email déjà utilisé, client possédant déjà un compte).
 * Traduite en HTTP 409 (Conflict) par le {@link GlobalExceptionHandler}.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
