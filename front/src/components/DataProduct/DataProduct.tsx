import { ReactComponent as Calendar } from "assets/svg/calendar.svg";

export default function DataProduct() {
  return <div className="w-full text-left p-10">
    <h1 className="text-3xl text-[--color-naranjo] font-bold mb-10">Productos de Datos General</h1>
    <div className=" bg-[--color-gris-claro] inline-block p-5 rounded-xl w-[290px]" >
<a href="/programa-fabricacion" className="flex hover:text-[--color-naranjo] items-center gap-5 mb-5" >
    <Calendar/>
<h2 className="text-2xl font-semibold">Programa de Fabricación</h2>
</a>
<p className="text-[--color-gris-oscuro]">Plan o cronograma que organiza y controla la fabricación</p>
    </div>
  </div>;
}
