import { apiClient } from './apiClient';
import type { ClientRequestDTO, ClientResponseDTO } from '../types';

/**
 * Couche d'accès à l'API REST pour /clients. Chaque fonction correspond
 * exactement à un endpoint du ClientController côté backend - aucune logique
 * ici, juste le mapping appel HTTP <-> typage TypeScript.
 */
export const clientService = {
  getAll(): Promise<ClientResponseDTO[]> {
    return apiClient.get<ClientResponseDTO[]>('/clients').then((res) => res.data);
  },

  getById(id: number): Promise<ClientResponseDTO> {
    return apiClient.get<ClientResponseDTO>(`/clients/${id}`).then((res) => res.data);
  },

  create(payload: ClientRequestDTO): Promise<ClientResponseDTO> {
    return apiClient.post<ClientResponseDTO>('/clients', payload).then((res) => res.data);
  },

  update(id: number, payload: ClientRequestDTO): Promise<ClientResponseDTO> {
    return apiClient.put<ClientResponseDTO>(`/clients/${id}`, payload).then((res) => res.data);
  },

  remove(id: number): Promise<void> {
    return apiClient.delete(`/clients/${id}`).then(() => undefined);
  },
};
