/**
 * Formate une date ISO 8601 (telle que renvoyée par le backend, ex: createdAt,
 * transactionDate) en format lisible français.
 */
export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formate un montant en euros, format français (ex: 1 234,56 €).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
