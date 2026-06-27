import axios from 'axios';

/**
 * Instance Axios unique, partagée par tous les services.
 *
 * baseURL = '/api' (relatif) : en développement, le proxy configuré dans
 * vite.config.ts redirige /api/* vers http://localhost:8080/*. En production,
 * cette même valeur pourrait être servie par un reverse proxy (nginx, etc.)
 * configuré de la même façon - le code applicatif n'a pas besoin de changer.
 *
 * VITE_API_BASE_URL permet de surcharger cette valeur si besoin (ex: pointer
 * directement vers le backend sans passer par le proxy de dev).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
