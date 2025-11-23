
import { ReactComponent as Calendar } from "assets/svg/calendar.svg";

export default function MenuLateral() {
  return (
    <div className="w-[280px] bg-[--color-gris-claro] p-5 text-left h-full">
        <a href="" className="flex gap-5 items-center">
        <Calendar/>
      <h2 className="text-2xl text-[--color-naranjo] font-semibold mb-4">Programa de Fabricación</h2>
        </a>
      <hr className="border-black mb-4" />
     <div className="flex flex-col gap-4">
        <h3 className=" text-xl font-semibold hover:text-white hover:bg-[--color-gris-oscuro]">Maestro Fert</h3>
        <h3 className=" text-xl font-semibold hover:text-white hover:bg-[--color-gris-oscuro]">Maestro OF</h3>
        <h3 className=" text-xl font-semibold hover:text-white hover:bg-[--color-gris-oscuro]">Maestro Batch</h3>
        <h3 className=" text-xl font-semibold hover:text-white hover:bg-[--color-gris-oscuro]">COOIS</h3>
        <h3 className=" text-xl font-semibold hover:text-white hover:bg-[--color-gris-oscuro]">Programa OFDF</h3>
     </div>
    </div>
  );
}
