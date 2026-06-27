import { apiClient } from './apiClient';
import type { AccountRequestDTO, AccountResponseDTO } from '../types';

export const accountService = {
  getAll(): Promise<AccountResponseDTO[]> {
    return apiClient.get<AccountResponseDTO[]>('/accounts').then((res) => res.data);
  },

  getById(id: number): Promise<AccountResponseDTO> {
    return apiClient.get<AccountResponseDTO>(`/accounts/${id}`).then((res) => res.data);
  },

  create(payload: AccountRequestDTO): Promise<AccountResponseDTO> {
    return apiClient.post<AccountResponseDTO>('/accounts', payload).then((res) => res.data);
  },
};
