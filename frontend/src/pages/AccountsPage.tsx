import { useCallback, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

import AccountFormDialog from '../components/AccountFormDialog';
import AppSnackbar from '../components/AppSnackbar';
import { useSnackbar } from '../hooks/useSnackbar';
import { accountService } from '../services/accountService';
import { clientService } from '../services/clientService';
import { getErrorMessage } from '../utils/apiError';
import { formatCurrency } from '../utils/format';
import type { AccountRequestDTO, AccountResponseDTO, AccountType, ClientResponseDTO } from '../types';

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CHECKING: 'Compte courant',
  SAVINGS: 'Compte épargne',
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountResponseDTO[]>([]);
  const [clients, setClients] = useState<ClientResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { snackbar, showSuccess, showError, close } = useSnackbar();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [accountsData, clientsData] = await Promise.all([
        accountService.getAll(),
        clientService.getAll(),
      ]);
      setAccounts(accountsData);
      setClients(clientsData);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Un client ne peut avoir qu'un seul compte (OneToOne côté backend) : on ne
  // propose à la création que les clients qui n'en ont pas encore.
  const eligibleClients = clients.filter(
    (client) => !accounts.some((account) => account.clientId === client.id),
  );

  async function handleSubmit(values: AccountRequestDTO) {
    try {
      const created = await accountService.create(values);
      setAccounts((prev) => [...prev, created]);
      showSuccess('Compte créé avec succès');
      setDialogOpen(false);
    } catch (err) {
      showError(getErrorMessage(err));
    }
  }

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Comptes
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Nouveau compte
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : accounts.length === 0 ? (
        <Typography color="text.secondary">Aucun compte pour l'instant.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° de compte</TableCell>
                <TableCell>IBAN</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Client</TableCell>
                <TableCell align="right">Solde</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{account.iban}</TableCell>
                  <TableCell>
                    <Chip size="small" label={ACCOUNT_TYPE_LABELS[account.accountType]} />
                  </TableCell>
                  <TableCell>{account.clientFullName}</TableCell>
                  <TableCell align="right">{formatCurrency(account.balance)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      aria-label="Voir l'historique"
                      onClick={() => navigate(`/transactions?accountId=${account.id}`)}
                    >
                      <HistoryIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AccountFormDialog
        open={dialogOpen}
        eligibleClients={eligibleClients}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <AppSnackbar {...snackbar} onClose={close} />
    </Box>
  );
}
