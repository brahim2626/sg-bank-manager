import { createTheme } from '@mui/material/styles';

/**
 * Thème MUI minimal mais personnalisé : on évite le bleu/violet par défaut
 * de MUI pour quelque chose qui évoque davantage l'univers bancaire
 * (bleu marine + accent doré), sans pour autant sur-designer l'interface -
 * le cahier des charges demande explicitement une interface "simple".
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: '#0B3D63',
    },
    secondary: {
      main: '#C9A227',
    },
    background: {
      default: '#F5F6F8',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});
