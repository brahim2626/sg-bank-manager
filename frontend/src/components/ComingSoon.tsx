import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ComingSoonProps {
  title: string;
}

/**
 * Placeholder pour les pages dont le contenu réel arrive à l'étape 5
 * (Clients, Comptes, Transactions). Permet de valider dès l'étape 4 que le
 * routing et le layout fonctionnent de bout en bout, sans encore avoir
 * implémenté les appels API ni les formulaires.
 */
export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Alert severity="info">
        Cette page sera implémentée à l'étape suivante (liste, formulaire de création/édition,
        appels à l'API REST du backend).
      </Alert>
    </Box>
  );
}
