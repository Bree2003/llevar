import React from 'react';


// --- 1. Las props que recibe del Controller no cambian ---
interface LoginScreenProps {
  isLoading?: boolean;
  onLoginClick: () => void;
}

const LoginScreen = ({ isLoading, onLoginClick }: LoginScreenProps) => {
  return (
    <div className="flex min-h-screen w-full">
      
      {/* --- Panel Izquierdo (Branding) --- */}
      <div className="hidden lg:flex w-1/2 bg-gray-800 items-center justify-center p-12">
        {/*
          Asegúrate de que la ruta de la imagen en 'src' sea correcta.
          Puedes ajustar el 'max-w-sm' o 'max-w-md' para cambiar el tamaño del logo.
        */}
        <img 
          src="/images/logo-blanco.png" 
          alt="Logo Viña Concha y Toro" 
          className="max-w-sm" 
        />
      </div>

      {/* --- Panel Derecho (Login) --- */}
      <div className="w-full lg:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-xs w-full">
        
          {/* Título de Bienvenida */}
          <h1 className="text-3xl font-bold text-[--color-naranjo]">
            ¡Bienvenido a tu Plataforma de Datos
            <br />
            Concha y Toro!
          </h1>

          {/* Texto de Instrucción */}
          <p className="mt-6 text-gray-700">
            Inicia sesión a través del siguiente enlace para poder ingresar
          </p>

          {/* Botón de Acción SSO */}
          <button
            onClick={onLoginClick}
            disabled={isLoading}
            className="mt-10 w-full bg-[--color-naranjo] text-white font-semibold py-3 px-6 rounded-lg text-base shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-wait"
          >
            {isLoading ? 'Redirigiendo...' : 'Iniciar Sesión SSO'}
          </button>
        
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;