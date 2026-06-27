package com.sgbankmanager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Forme JSON uniforme de toutes les réponses d'erreur de l'API.
 * Immutable : construit une seule fois par le {@link com.sgbankmanager.exception.GlobalExceptionHandler}
 * via le builder, jamais modifié ensuite.
 */
@Getter
@Builder
public class ErrorResponseDTO {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    private int status;
    private String error;
    private String message;
    private String path;

    // Présent uniquement pour les erreurs de validation (Jakarta Validation) :
    // une entrée par champ invalide. Omis du JSON si vide/null.
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<String> details;
}
