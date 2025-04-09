import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Ajouter pour prendre en charge les cookies
});

// Intercepteur pour ajouter le token à CHAQUE requête
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  console.log('Intercepteur API - Préparation requête vers:', config.url);
  
  if (token) {
    // Toujours définir explicitement l'en-tête Authorization
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Token ajouté aux headers:', `Bearer ${token.substring(0, 15)}...`);
  } else {
    console.warn('Aucun token trouvé dans localStorage pour la requête');
  }
  
  return config;
}, error => {
  console.error('Erreur dans l\'intercepteur de requête:', error);
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    // Log détaillé de l'erreur
    console.error('Erreur API:', {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.response?.data?.error || error.message
    });
    
    if (error.response?.status === 401 && !error.config.url.includes('/users/login')) {
      console.warn('Session expirée ou invalide - Déconnexion');
      localStorage.removeItem('token');
      // Redirection vers login en dernier recours, si pas dans une page de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;