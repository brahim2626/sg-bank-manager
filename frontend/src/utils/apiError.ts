import axios from 'axios';
import type { ErrorResponseDTO } from '../types';

/**
 * Extrait un message d'erreur lisible à afficher à l'utilisateur, à partir
 * de n'importe quelle erreur attrapée dans un catch.
 *
 * Le backend renvoie systématiquement un ErrorResponseDTO (cf. GlobalExceptionHandler
 * côté Java) - on essaie de le lire en priorité. Sinon, on retombe sur un message
 * générique plutôt que d'afficher une erreur technique brute à l'utilisateur.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponseDTO>(error)) {
    const data = error.response?.data;

    if (data?.details && data.details.length > 0) {
      // Erreurs de validation Jakarta : plusieurs messages, un par champ invalide.
      return data.details.join(' · ');
    }
    if (data?.message) {
      return data.message;
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Impossible de contacter le serveur. Vérifie que le backend est démarré.';
    }
  }

  return 'Une erreur inattendue est survenue. Merci de réessayer.';
}
