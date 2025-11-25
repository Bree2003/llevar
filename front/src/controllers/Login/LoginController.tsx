import React, { useState } from 'react';
import LoginScreen from 'screens/Login/Login';

// En un futuro, podrías tener un servicio para obtener la URL de login
// import * as authService from 'services/authService';

const LoginController = () => {
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. Lógica para manejar el clic en el botón de login ---
  const handleLoginClick = async () => {
    setIsLoading(true);

    try {
      // --- PASO CLAVE: Redirigir al usuario al endpoint de Azure ---

      // En un caso real, NO deberías tener esta URL hardcodeada aquí.
      // Lo ideal es que tu backend tenga un endpoint (ej: /api/auth/microsoft/url)
      // que construya y devuelva la URL correcta para el entorno (dev, prod).
      //
      // const { redirectUrl } = await authService.getMicrosoftLoginUrl();
      
      // Para este ejemplo, simulamos la obtención de la URL y usamos una de ejemplo.
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula la llamada a la red
      
    //   const azureLoginUrl = 'https://login.microsoftonline.com/TU_TENANT_ID/oauth2/v2.0/authorize?client_id=TU_CLIENT_ID&response_type=code&redirect_uri=TU_REDIRECT_URI&scope=...';
      const azureLoginUrl = '/';
      
      // Esta es la línea que redirige el navegador del usuario a la página de Microsoft.
      window.location.href = azureLoginUrl;

      // Nota: No necesitas poner setIsLoading(false) aquí, porque el navegador
      // abandonará esta página.

    } catch (error) {
      console.error("Error al obtener la URL de redirección:", error);
      // Podrías mostrar un error en la UI si falla la obtención de la URL
      setIsLoading(false);
    }
  };

  // --- 2. Renderizamos el Screen, pasándole solo las props que necesita ---
  return (
    <LoginScreen
      isLoading={isLoading}
      onLoginClick={handleLoginClick}
    />
  );
};

export default LoginController;