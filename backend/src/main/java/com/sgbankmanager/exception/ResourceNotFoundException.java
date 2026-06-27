package com.sgbankmanager.exception;

/**
 * Levée lorsqu'une ressource demandée (client, compte, transaction...)
 * n'existe pas en base. Traduite en HTTP 404 par le {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
