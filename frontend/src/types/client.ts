/**
 * Types miroir des DTOs Java du backend (com.sgbankmanager.dto.ClientRequestDTO /
 * ClientResponseDTO). Garder ces deux DTOs et ces deux types alignés est le
 * "contrat" implicite de l'API entre les deux projets.
 */

export interface ClientRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ClientResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string; // ISO 8601, sérialisé tel quel par Jackson - voir utils/date.ts pour l'affichage
}
