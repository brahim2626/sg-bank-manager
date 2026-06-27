/**
 * Types miroir de com.sgbankmanager.dto.AccountRequestDTO / AccountResponseDTO
 * et de l'enum com.sgbankmanager.entity.AccountType.
 */

export type AccountType = 'CHECKING' | 'SAVINGS';

export interface AccountRequestDTO {
  clientId: number;
  accountType: AccountType;
}

export interface AccountResponseDTO {
  id: number;
  accountNumber: string;
  iban: string;
  accountType: AccountType;
  balance: number;
  clientId: number;
  clientFullName: string;
}
