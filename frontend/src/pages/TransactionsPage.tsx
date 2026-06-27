import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AppSnackbar from '../components/AppSnackbar';
import { useSnackbar } from '../hooks/useSnackbar';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';
import { getErrorMessage } from '../utils/apiError';
import { formatCurrency, formatDateTime } from '../utils/format';
import type { AccountResponseDTO, TransactionResponseDTO } from '../types';

export default function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterAccountId = searchParams.get('accountId');

  const [accounts, setAccounts] = useState<AccountResponseDTO[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAccountId, setSelectedAccountId] = useState<number | ''>('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { snackbar, showSuccess, showError, close } = useSnackbar();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const accountIdFilter = filterAccountId ? Number(filterAccountId) : undefined;
      const [accountsData, transactionsData] = await Promise.all([
        accountService.getAll(),
        transactionService.getAll(accountIdFilter),
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filterAccountId, showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Si on arrive depuis le bouton "historique" de la page Comptes, on
  // pré-sélectionne directement ce compte dans le formulaire dépôt/retrait.
  useEffect(() => {
    if (filterAccountId) {
      setSelectedAccountId(Number(filterAccountId));
    }
  }, [filterAccountId]);

  const filteredAccount = useMemo(
    () => (filterAccountId ? accounts.find((a) => a.id === Number(filterAccountId)) : undefined),
    [accounts, filterAccountId],
  );

  async function handleOperation(type: 'deposit' | 'withdraw') {
    const parsedAmount = Number(amount);
    if (selectedAccountId === '' || !parsedAmount || parsedAmount <= 0) {
      showError('Sélectionne un compte et un montant strictement positif.');
      return;
    }

    setSubmitting(true);
    try {
      const operation = type === 'deposit' ? transactionService.deposit : transactionService.withdraw;
      const result = await operation({ accountId: selectedAccountId, amount: parsedAmount });

      // Mise à jour optimiste locale : pas besoin de tout recharger depuis
      // l'API, la réponse du backend contient déjà la transaction créée ET
      // le nouveau solde du compte (cf. TransactionResponseDTO.newBalance).
      setTransactions((prev) => [result, ...prev]);
      setAccounts((prev) =>
        prev.map((a) => (a.id === result.accountId ? { ...a, balance: result.newBalance } : a)),
      );
      setAmount('');
      showSuccess(type === 'deposit' ? 'Dépôt effectué avec succès' : 'Retrait effectué avec succès');
    } catch (err) {
      // C'est ici qu'atterrit le message clair du backend en cas de solde
      // insuffisant (HTTP 422), via getErrorMessage.
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 3 }}>
        Transactions
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Effectuer une opération
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
          <TextField
            select
            label="Compte"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(Number(e.target.value))}
            sx={{ minWidth: 280 }}
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.accountNumber} — {account.clientFullName} ({formatCurrency(account.balance)})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Montant"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            sx={{ width: 160 }}
          />
          <Button
            variant="contained"
            color="success"
            disabled={submitting}
            onClick={() => handleOperation('deposit')}
          >
            Déposer
          </Button>
          <Button
            variant="contained"
            color="warning"
            disabled={submitting}
            onClick={() => handleOperation('withdraw')}
          >
            Retirer
          </Button>
        </Stack>
      </Paper>

      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {filteredAccount
            ? `Historique du compte ${filteredAccount.accountNumber}`
            : 'Historique de toutes les transactions'}
        </Typography>
        {filterAccountId && (
          <Button size="small" onClick={() => setSearchParams({})}>
            Voir tout l'historique
          </Button>
        )}
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Typography color="text.secondary">Aucune transaction pour l'instant.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 480 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Compte</TableCell>
                <TableCell align="right">Montant</TableCell>
                <TableCell align="right">Solde après opération</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{formatDateTime(transaction.transactionDate)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={transaction.type === 'DEPOSIT' ? 'Dépôt' : 'Retrait'}
                      color={transaction.type === 'DEPOSIT' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{transaction.accountNumber}</TableCell>
                  <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell align="right">{formatCurrency(transaction.newBalance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AppSnackbar {...snackbar} onClose={close} />
    </Box>
  );
}
