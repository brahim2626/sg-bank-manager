import { apiClient } from './apiClient';
import type { TransactionRequestDTO, TransactionResponseDTO } from '../types';

export const transactionService = {
  /** Sans accountId : tout l'historique. Avec accountId : filtré sur un compte. */
  getAll(accountId?: number): Promise<TransactionResponseDTO[]> {
    return apiClient
      .get<TransactionResponseDTO[]>('/transactions', { params: accountId ? { accountId } : undefined })
      .then((res) => res.data);
  },

  deposit(payload: TransactionRequestDTO): Promise<TransactionResponseDTO> {
    return apiClient.post<TransactionResponseDTO>('/transactions/deposit', payload).then((res) => res.data);
  },

  withdraw(payload: TransactionRequestDTO): Promise<TransactionResponseDTO> {
    return apiClient.post<TransactionResponseDTO>('/transactions/withdraw', payload).then((res) => res.data);
  },
};
