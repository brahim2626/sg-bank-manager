/**
 * Miroir de com.sgbankmanager.dto.ErrorResponseDTO : la forme JSON que renvoie
 * le GlobalExceptionHandler du backend pour TOUTE erreur (404, 409, 422, 400, 500).
 */
export interface ErrorResponseDTO {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: string[];
}
