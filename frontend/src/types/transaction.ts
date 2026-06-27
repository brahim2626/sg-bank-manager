/**
 * Types miroir de com.sgbankmanager.dto.TransactionRequestDTO / TransactionResponseDTO
 * et de l'enum com.sgbankmanager.entity.TransactionType.
 */

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL';

export interface TransactionRequestDTO {
  accountId: number;
  amount: number;
}

export interface TransactionResponseDTO {
  id: number;
  type: TransactionType;
  amount: number;
  transactionDate: string; // ISO 8601
  accountId: number;
  accountNumber: string;
  newBalance: number;
}
