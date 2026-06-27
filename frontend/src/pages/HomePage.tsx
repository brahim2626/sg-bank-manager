import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
}

function SectionCard({ icon, title, description, to }: SectionCardProps) {
  return (
    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={to} size="small">
          Accéder
        </Button>
      </CardActions>
    </Card>
  );
}

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Bienvenue sur SG Bank Manager
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 720 }}>
        Une application de démonstration pour gérer des clients, leurs comptes bancaires
        et leurs opérations (dépôts et retraits), avec une règle simple mais non négociable :
        le solde d'un compte ne peut jamais devenir négatif.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <SectionCard
          icon={<GroupIcon fontSize="large" />}
          title="Clients"
          description="Créer, consulter, modifier et supprimer les clients de la banque."
          to="/clients"
        />
        <SectionCard
          icon={<AccountBalanceWalletIcon fontSize="large" />}
          title="Comptes"
          description="Ouvrir un compte bancaire pour un client (numéro et IBAN générés automatiquement)."
          to="/accounts"
        />
        <SectionCard
          icon={<SwapHorizIcon fontSize="large" />}
          title="Transactions"
          description="Effectuer des dépôts, des retraits, et consulter l'historique des opérations."
          to="/transactions"
        />
      </Stack>
    </Box>
  );
}
