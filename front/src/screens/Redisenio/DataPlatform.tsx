import React, { useState } from 'react';

const DataPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Inicio');

  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6] font-sans text-gray-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="fixed z-10 flex h-full w-[260px] flex-col border-r border-gray-200 bg-white p-6">
        {/* Logo Area */}
        <div className="mb-10 flex items-center gap-2.5 text-lg font-bold text-gray-800">
          <div className="h-[30px] w-[30px] rounded bg-gray-800"></div> {/* Placeholder Logo */}
          <span>DATA PLATFORM</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {[
            { name: 'Inicio', icon: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /> },
            { name: 'Programas', icon: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /> },
            { name: 'Ingesta de Datos', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /> }, // Icono genérico para ejemplo
            { name: 'Configuración', icon: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 00-.59.22L5.19 8.87a.49.49 0 00.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.21.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /> }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                activeTab === item.name
                  ? 'bg-[#FFF0EB] text-[#FF5B35] font-semibold'
                  : 'text-gray-500 hover:bg-[#FFF0EB] hover:text-[#FF5B35]'
              }`}
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">{item.icon}</svg>
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="ml-[260px] flex-1 p-8 max-w-[1600px]">
        
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex w-[400px] items-center rounded-full border border-gray-200 bg-white px-4 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors focus-within:border-[#FF5B35] focus-within:ring-2 focus-within:ring-[#FF5B35]/10">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar producto, dataset o indicador..."
              className="ml-2.5 w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-4">
            {['notifications', 'person'].map((icon) => (
              <button key={icon} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#FF5B35] hover:text-[#FF5B35]">
                 {/* Icono simple para simular user/notif */}
                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                   <circle cx="12" cy="12" r="6" />
                 </svg>
              </button>
            ))}
          </div>
        </header>

        {/* Sección 1: Cards */}
        <section className="mb-16">
          <h1 className="mb-2 text-[1.8rem] font-bold text-gray-900">Hola, Usuario</h1>
          <p className="mb-8 max-w-[700px] text-gray-500">Bienvenido a tu centro de control. Gestiona producción, distribución y análisis de forma centralizada.</p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Gestiona Productos', desc: 'Accede a las tablas maestras de fabricación y catálogos de productos.', iconPath: "M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" },
              { title: 'Ingesta de Tablas', desc: 'Carga nuevos datasets, valida estructuras y consolida información semanal.', iconPath: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" },
              { title: 'Modificación Rápida', desc: 'Edita parámetros críticos y gestiona excepciones en tiempo real.', iconPath: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" },
            ].map((card, idx) => (
              <div key={idx} className="group flex cursor-pointer flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0EB] text-[#FF5B35]">
                   <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d={card.iconPath}/></svg>
                </div>
                <div className="text-lg font-semibold">{card.title}</div>
                <div className="text-sm leading-relaxed text-gray-500">{card.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección 2: Tabla */}
        <section className="mb-16">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Últimas Ejecuciones</h2>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
                Filtrar
              </button>
            </div>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  {['Dataset', 'Archivo Fuente', 'Última Carga', 'Estado', 'Acciones'].map((head) => (
                    <th key={head} className="border-b border-gray-200 bg-gray-50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { name: 'Maestro Fert', file: 'carga_maestro_fert.csv', date: '06/08/2025 • 12:35', status: 'Exitoso', ok: true },
                  { name: 'Programa Batch', file: 'carga_maestro_batch.csv', date: '06/08/2025 • 12:40', status: 'Error en formato', ok: false },
                  { name: 'COOIS Producción', file: 'coois_export_v2.xlsx', date: '06/08/2025 • 13:15', status: 'Exitoso', ok: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.file}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${row.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <svg className="h-5 w-5 cursor-pointer hover:text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sección 3: Ingesta */}
        <section>
          <h2 className="mb-8 text-xl font-semibold text-gray-900">Nueva Carga de Datos</h2>
          
          <div className="mb-8 flex items-center">
            <div className="flex items-center gap-2 font-semibold text-[#FF5B35]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF5B35] text-xs font-bold text-white">1</div>
              <span className="text-sm">Cargar Archivo</span>
            </div>
            <div className="mx-4 h-[1px] w-12 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-white">2</div>
              <span className="text-sm">Validar Estructura</span>
            </div>
            <div className="mx-4 h-[1px] w-12 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-white">3</div>
              <span className="text-sm">Confirmar</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center transition-all hover:border-[#FF5B35] hover:bg-[#FFF7F5]">
              <svg className="mx-auto mb-3 h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
              </svg>
              <h3 className="mb-1 text-lg font-medium text-gray-900">Arrastra tu archivo aquí</h3>
              <p className="mb-6 text-sm text-gray-500">Soporta CSV, Excel o JSON hasta 50MB</p>
              <button className="inline-flex items-center rounded-lg bg-[#FF5B35] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#E04824]">
                Examinar Archivos
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default DataPlatform;