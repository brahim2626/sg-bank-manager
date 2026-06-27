import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { AccountRequestDTO, AccountType, ClientResponseDTO } from '../types';

interface AccountFormDialogProps {
  open: boolean;
  /** Uniquement les clients qui n'ont pas encore de compte (relation OneToOne côté backend). */
  eligibleClients: ClientResponseDTO[];
  onClose: () => void;
  onSubmit: (values: AccountRequestDTO) => Promise<void>;
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CHECKING: 'Compte courant',
  SAVINGS: 'Compte épargne',
};

export default function AccountFormDialog({
  open,
  eligibleClients,
  onClose,
  onSubmit,
}: AccountFormDialogProps) {
  const [clientId, setClientId] = useState<number | ''>('');
  const [accountType, setAccountType] = useState<AccountType>('CHECKING');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setClientId('');
      setAccountType('CHECKING');
      setError(null);
    }
  }, [open]);

  async function handleSubmit() {
    if (clientId === '') {
      setError('Sélectionne un client');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ clientId, accountType });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nouveau compte</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {eligibleClients.length === 0 ? (
            <Typography color="text.secondary">
              Tous les clients existants ont déjà un compte. Crée d'abord un nouveau client.
            </Typography>
          ) : (
            <TextField
              select
              label="Client"
              value={clientId}
              onChange={(e) => setClientId(Number(e.target.value))}
              error={!!error}
              helperText={error}
              fullWidth
            >
              {eligibleClients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            select
            label="Type de compte"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as AccountType)}
            fullWidth
            disabled={eligibleClients.length === 0}
          >
            {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || eligibleClients.length === 0}
        >
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
