// screens/Main/Main.tsx

import { useNavigate } from "react-router-dom";

// --- Iconos SVG creados para replicar el diseño ---
// En un proyecto real, estos podrían ser archivos separados.

const IconGestiona = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[--color-naranjo]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25M12 12.75l9 5.25" />
  </svg>
);

const IconIngesta = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[--color-naranjo]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>
);

const IconModifica = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[--color-naranjo]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125A1.125 1.125 0 003 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);


// --- Componente principal de la pantalla ---
const MainScreen = () => {
  const navigate = useNavigate();

  // Función para manejar el clic del botón y navegar a la vista de ingesta/exploración.
  const handleExploreClick = () => {
    // Apunta a la ruta principal de tu flujo de ingesta.
    // Cámbiala si tu ruta principal es diferente.
    navigate('/dashboard'); 
  };

  return (
    <main className="flex flex-col items-center justify-center w-full h-full bg-gray-50 text-center p-8">
      <div className="max-w-4xl w-full">
        
        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl font-bold text-[--color-naranjo]">
          ¡Bienvenido a tu Plataforma de Datos
          <br />
          Concha y Toro!
        </h1>

        {/* Descripción */}
        <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto">
          Accede, visualiza y analiza toda la información clave para tus operaciones. Desde producción hasta la distribución, centralizamos tus datos para una toma de decisiones más eficientes y más estratégica.
        </p>

        {/* Título de la sección de características */}
        <h2 className="mt-20 text-3xl font-bold text-gray-800">
          ¿Qué puedes hacer aquí?
        </h2>

        {/* Contenedor de las tarjetas de características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
            <IconGestiona />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Gestiona tus productos</h3>
            <p className="mt-2 text-sm text-gray-600">
              Accede a diversas tablas según tus tipos de ingestas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
            <IconIngesta />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Ingesta tus tablas</h3>
            <p className="mt-2 text-sm text-gray-600">
              Puedes ingestar tus archivos a las diversas tablas existentes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
            <IconModifica />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Modifica al momento</h3>
            <p className="mt-2 text-sm text-gray-600">
              Puedes editar las tablas allí mismo, para agregar y eliminar.
            </p>
          </div>
        </div>

        {/* Botón de Llamada a la Acción (CTA) */}
        <button
          onClick={handleExploreClick}
          className="mt-20 bg-[--color-naranjo] text-white font-bold py-3 px-10 rounded-lg text-lg shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Empezar a explorar
        </button>

      </div>
    </main>
  );
};

export default MainScreen;