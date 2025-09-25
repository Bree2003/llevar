export default function QuickAccess() {
  return (
    <div className="w-[420px] bg-[--color-gris-claro] p-5 text-left h-full">
      <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
      <hr className="border-black mb-4" />
      <h3 className="text-xl font-semibold mb-4">Favoritos</h3>
      <div className="p-2 bg-white rounded-xl mb-4 flex flex-col gap-2">
        <p className="hover:bg-[--color-gris-claro]">Carga Avisos</p>
        <p className="hover:bg-[--color-gris-claro]">Maestro Fert</p>
        <p className="hover:bg-[--color-gris-claro]">Merma Semanal</p>
        <p className="hover:bg-[--color-gris-claro]">Maestro Insumos</p>
        <p className="hover:bg-[--color-gris-claro]">Maestro OF</p>
      </div>
      <h3 className="text-xl font-semibold mb-4">Tus últimas modificaciones</h3>
      <div className="p-2 bg-white rounded-xl flex flex-col gap-2">
        <p className="hover:bg-[--color-gris-claro] leading-none">
          Carga Avisos <br />
          <span className="text-sm text-[--color-gris-oscuro]">
            Fecha: 21/08/2025 14:35 hrs
          </span>
        </p>
        <p className="hover:bg-[--color-gris-claro] leading-none">
          Maestro Fert <br />
          <span className="text-sm text-[--color-gris-oscuro]">
            Fecha: 21/08/2025 14:35 hrs
          </span>
        </p>
        <p className="hover:bg-[--color-gris-claro] leading-none">
          Merma Semanal <br />
          <span className="text-sm text-[--color-gris-oscuro]">
            Fecha: 21/08/2025 14:35 hrs
          </span>
        </p>
        <p className="hover:bg-[--color-gris-claro] leading-none">
          Maestro Insumos <br />
          <span className="text-sm text-[--color-gris-oscuro]">
            Fecha: 21/08/2025 14:35 hrs
          </span>
        </p>
        <p className="hover:bg-[--color-gris-claro] leading-none">
          Maestro OF <br />
          <span className="text-sm text-[--color-gris-oscuro]">
            Fecha: 21/08/2025 14:35 hrs
          </span>
        </p>
      </div>
    </div>
  );
}
