// src/setupProxy.ts
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Application } from 'express'; // Importa el tipo para 'app'

const setupProxy = (app: Application) => {
  app.use(
    '/api', // Solo las peticiones que empiecen con /api serán redirigidas
    createProxyMiddleware({
      target: 'http://localhost:5000', // La URL de tu backend Flask
      changeOrigin: true,
    })
  );
};

export default setupProxy;