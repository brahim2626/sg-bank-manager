import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { NavLink, Outlet } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/clients', label: 'Clients' },
  { to: '/accounts', label: 'Comptes' },
  { to: '/transactions', label: 'Transactions' },
];

/**
 * Layout commun à toutes les pages : barre de navigation MUI en haut, puis
 * <Outlet /> qui affiche la page active (cf. la configuration des routes
 * imbriquées dans App.tsx).
 */
export default function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <AccountBalanceIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            SG Bank Manager
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                end={link.to === '/'}
                sx={{
                  color: 'inherit',
                  '&.active': { textDecoration: 'underline', textDecorationThickness: '2px' },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
