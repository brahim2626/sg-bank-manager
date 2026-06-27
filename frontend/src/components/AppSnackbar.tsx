import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarSeverity } from '../hooks/useSnackbar';

interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  onClose: () => void;
}

export default function AppSnackbar({ open, message, severity, onClose }: AppSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
