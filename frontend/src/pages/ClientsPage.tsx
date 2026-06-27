import { useCallback, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

import AppSnackbar from '../components/AppSnackbar';
import ClientFormDialog from '../components/ClientFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSnackbar } from '../hooks/useSnackbar';
import { clientService } from '../services/clientService';
import { getErrorMessage } from '../utils/apiError';
import { formatDateTime } from '../utils/format';
import type { ClientRequestDTO, ClientResponseDTO } from '../types';

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientResponseDTO | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientResponseDTO | null>(null);
  const { snackbar, showSuccess, showError, close } = useSnackbar();

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      setClients(await clientService.getAll());
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  function openCreateDialog() {
    setEditingClient(null);
    setDialogOpen(true);
  }

  function openEditDialog(client: ClientResponseDTO) {
    setEditingClient(client);
    setDialogOpen(true);
  }

  async function handleSubmit(values: ClientRequestDTO) {
    try {
      if (editingClient) {
        const updated = await clientService.update(editingClient.id, values);
        setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showSuccess('Client mis à jour avec succès');
      } else {
        const created = await clientService.create(values);
        setClients((prev) => [...prev, created]);
        showSuccess('Client créé avec succès');
      }
      setDialogOpen(false);
    } catch (err) {
      // Le dialog reste ouvert : l'utilisateur peut corriger et resoumettre
      // (ex: 409 si l'email est déjà pris par un autre client).
      showError(getErrorMessage(err));
    }
  }

  async function handleConfirmDelete() {
    if (!clientToDelete) return;
    try {
      await clientService.remove(clientToDelete.id);
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
      showSuccess('Client supprimé');
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setClientToDelete(null);
    }
  }

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Clients
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Nouveau client
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : clients.length === 0 ? (
        <Typography color="text.secondary">Aucun client pour l'instant.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Prénom</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Client depuis</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>{client.firstName}</TableCell>
                  <TableCell>{client.lastName}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || '—'}</TableCell>
                  <TableCell>{formatDateTime(client.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" aria-label="Modifier" onClick={() => openEditDialog(client)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Supprimer"
                      color="error"
                      onClick={() => setClientToDelete(client)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ClientFormDialog
        open={dialogOpen}
        initialValues={
          editingClient
            ? {
                firstName: editingClient.firstName,
                lastName: editingClient.lastName,
                email: editingClient.email,
                phone: editingClient.phone,
              }
            : null
        }
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={clientToDelete !== null}
        title="Supprimer ce client ?"
        message={
          clientToDelete
            ? `${clientToDelete.firstName} ${clientToDelete.lastName} sera définitivement supprimé, ainsi que son compte et son historique de transactions.`
            : ''
        }
        confirmLabel="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setClientToDelete(null)}
      />

      <AppSnackbar {...snackbar} onClose={close} />
    </Box>
  );
}
