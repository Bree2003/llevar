import React from 'react';
import './Login.css';

// --- 1. Las props se mantienen idénticas ---
interface LoginScreenProps {
  isLoading?: boolean;
  onLoginClick: () => void;
}

const LoginScreen = ({ isLoading, onLoginClick }: LoginScreenProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Iniciando sesión...");
  };
  return (
   <div className="flex text-left h-screen w-full overflow-hidden bg-white font-sans text-gray-800">
      
      {/* --- LADO IZQUIERDO (BRANDING) --- */}
      <div className="bg-brand-image relative hidden flex-1 flex-col justify-end bg-[#111827] bg-cover bg-center px-16 py-20 text-white lg:flex">
        <div className="relative z-10 max-w-[550px]">
          <span className="mb-5 inline-block rounded-full border border-[#FF5B35] bg-[#FF5B35]/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FF5B35]">
            Versión 2.0
          </span>
          <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight">
            Gobierno y Gestión de Datos
          </h1>
          <p className="max-w-[450px] text-lg font-light leading-relaxed opacity-80">
            Plataforma centralizada para la ingesta, catalogación y control de calidad de la información productiva.
          </p>
        </div>
      </div>

      {/* --- LADO DERECHO (LOGIN) --- */}
      <div className="relative flex w-full flex-shrink-0 flex-col items-center justify-center bg-white p-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] md:w-[550px]">
        
        {/* Status Badge */}
        <div className="absolute right-8 top-8 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_2px_#D1FAE5]"></div>
          Online
        </div>

        {/* Contenedor Login */}
        <div className="w-full max-w-[380px]">
          
          {/* Logo Area */}
          <div className="mb-10 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-white material-symbols-outlined">
              hub
            </div>
            <span className="text-lg font-bold tracking-wide text-gray-800">DATA HUB</span>
          </div>

          {/* Textos de Bienvenida */}
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">Bienvenido</h2>
            <p className="text-[0.95rem] leading-relaxed text-gray-500">
              Utiliza tu cuenta corporativa para acceder a los catálogos de datos y procesos de ingesta.
            </p>
          </div>

          {/* Botón Microsoft */}
          <button className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#2F2F2F] text-base font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#111] hover:shadow-lg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft Logo" width="22" />
            Iniciar sesión con Microsoft
          </button>

          {/* Separador */}
          <div className="my-10 flex items-center text-center text-xs font-medium uppercase tracking-widest text-gray-400 before:mr-4 before:flex-1 before:border-b before:border-gray-200 after:ml-4 after:flex-1 after:border-b after:border-gray-200">
            Módulos Habilitados
          </div>

          {/* Grid de Módulos */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* Módulo 1 */}
            <div className="group cursor-default rounded-xl border border-transparent bg-gray-50 p-4 text-center transition-all hover:border-orange-200 hover:bg-white hover:shadow-sm">
              <div className="mx-auto material-symbols-outlined mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF0EB] text-[#FF5B35]">
                menu_book
              </div>
              <span className="block text-xs text-center font-semibold text-gray-800">Catálogos</span>
              <span className="text-[0.65rem] text-gray-500">Maestros</span>
            </div>

            {/* Módulo 2 */}
            <div className="group cursor-default rounded-xl border border-transparent bg-gray-50 p-4 text-center transition-all hover:border-orange-200 hover:bg-white hover:shadow-sm">
              <div className="mx-auto material-symbols-outlined mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF0EB] text-[#FF5B35]">
                cloud_sync
              </div>
              <span className="block text-xs text-center font-semibold text-gray-800">Ingesta</span>
              <span className="text-[0.65rem] text-gray-500">Cargas</span>
            </div>

            {/* Módulo 3 */}
            <div className="group cursor-default rounded-xl border border-transparent bg-gray-50 p-4 text-center transition-all hover:border-orange-200 hover:bg-white hover:shadow-sm">
              <div className="mx-auto mb-2 material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF0EB] text-[#FF5B35]">
                fact_check
              </div>
              <span className="block text-xs text-center font-semibold text-gray-800">Calidad</span>
              <span className="text-[0.65rem] text-gray-500">Validación</span>
            </div>

          </div>

          <div className="mt-12 text-center text-xs text-gray-400">
            &copy; 2025 Viña Concha y Toro S.A.
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginScreen;