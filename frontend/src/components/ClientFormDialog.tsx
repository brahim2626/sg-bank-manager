import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { ClientRequestDTO } from '../types';

interface ClientFormDialogProps {
  open: boolean;
  /** null = création, sinon valeurs initiales pour l'édition */
  initialValues: ClientRequestDTO | null;
  onClose: () => void;
  onSubmit: (values: ClientRequestDTO) => Promise<void>;
}

const EMPTY_FORM: ClientRequestDTO = { firstName: '', lastName: '', email: '', phone: '' };

type FieldErrors = Partial<Record<keyof ClientRequestDTO, string>>;

/**
 * Validation client-side : feedback immédiat sans aller-retour réseau.
 * Elle reprend volontairement les mêmes règles que les annotations Jakarta
 * Validation du backend (@NotBlank, @Email) - mais le backend reste la seule
 * source de vérité (ex: l'unicité de l'email n'est vérifiée que côté serveur,
 * une erreur 409 remontera via le Snackbar si besoin).
 */
function validate(form: ClientRequestDTO): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'Le prénom est obligatoire';
  if (!form.lastName.trim()) errors.lastName = 'Le nom est obligatoire';
  if (!form.email.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "L'email doit être une adresse valide";
  }
  return errors;
}

export default function ClientFormDialog({ open, initialValues, onClose, onSubmit }: ClientFormDialogProps) {
  const [form, setForm] = useState<ClientRequestDTO>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = initialValues !== null;

  // Réinitialise le formulaire chaque fois que le dialog s'ouvre (création
  // vierge, ou pré-rempli avec les valeurs du client à éditer).
  useEffect(() => {
    if (open) {
      setForm(initialValues ?? EMPTY_FORM);
      setFieldErrors({});
    }
  }, [open, initialValues]);

  async function handleSubmit() {
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? 'Modifier le client' : 'Nouveau client'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Prénom"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            error={!!fieldErrors.firstName}
            helperText={fieldErrors.firstName}
            fullWidth
            autoFocus
          />
          <TextField
            label="Nom"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            error={!!fieldErrors.lastName}
            helperText={fieldErrors.lastName}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            fullWidth
          />
          <TextField
            label="Téléphone"
            value={form.phone ?? ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {isEditMode ? 'Enregistrer' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
