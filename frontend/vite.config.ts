import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Toute requête frontend vers /api/* est transparemment redirigée vers
    // le backend Spring Boot (http://localhost:8080), sans le préfixe /api.
    // Avantage : aucune configuration CORS nécessaire côté Spring Boot en
    // développement, le navigateur ne voit qu'une seule origine (le serveur Vite).
    // En production, ce proxy n'existe plus : il faudrait soit servir le build
    // statique du frontend depuis le backend, soit activer CORS explicitement.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
