import { ReactComponent as Ok } from "assets/svg/tick-circle.svg";
import { ReactComponent as Error } from "assets/svg/close-circle.svg";
import { ReactComponent as ArrowLeft } from "assets/svg/arrow-left.svg";


export default function ResumenProducto() {
    return (
        <div>
            <div className="">
                <h2 className="font-bold text-left text-2xl mb-10">Resumen Programa de Fabricación</h2>
                <div className="overflow-x-auto mb-3">
                    <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-4">Dataset</th>
                                <th scope="col" className="px-6 py-4">Nombre de archivo</th>
                                <th scope="col" className="px-6 py-4">Última carga</th>
                                <th scope="col" className="px-6 py-4">Hora</th>
                                <th scope="col" className="px-6 py-4">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b transition duration-300 ease-in-out hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4 font-medium">Maestro FERT</td>
                                <td className="whitespace-nowrap px-6 py-4">maestro_fert_20250923.csv</td>
                                <td className="whitespace-nowrap px-6 py-4">23/09/2025</td>
                                <td className="whitespace-nowrap px-6 py-4">14:30</td>
                                <td className="whitespace-nowrap px-6 py-4 flex items-center gap-1">
                                    <Ok /> Ok
                                </td>
                            </tr>
                            <tr className="border-b transition duration-300 ease-in-out hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4 font-medium">Maestro OF</td>
                                <td className="whitespace-nowrap px-6 py-4">ordenes_fabricacion.csv</td>
                                <td className="whitespace-nowrap px-6 py-4">23/09/2025</td>
                                <td className="whitespace-nowrap px-6 py-4">15:02</td>
                                <td className="whitespace-nowrap px-6 py-4 flex items-center gap-1">
                                    <Ok /> Ok
                                </td>
                            </tr>
                            <tr className="border-b transition duration-300 ease-in-out hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4 font-medium">COOIS</td>
                                <td className="whitespace-nowrap px-6 py-4">reporte_coois_hist.csv</td>
                                <td className="whitespace-nowrap px-6 py-4">22/09/2025</td>
                                <td className="whitespace-nowrap px-6 py-4">08:00</td>
                               <td className="whitespace-nowrap px-6 py-4 flex items-center gap-1">
                                    <Error /> Error
                                </td>
                            </tr>
                            <tr className="transition duration-300 ease-in-out hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4 font-medium">Programa OFDF</td>
                                <td className="whitespace-nowrap px-6 py-4">programa_diario.csv</td>
                                <td className="whitespace-nowrap px-6 py-4">24/09/2025</td>
                                <td className="whitespace-nowrap px-6 py-4">09:00</td>
                                <td className="whitespace-nowrap px-6 py-4 flex items-center gap-1">
                                    <Ok /> Ok
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="text-right flex justify-end">
                <a href="" className="text-[--color-naranjo] flex gap-1">Ver últimas modificaciones <ArrowLeft/></a>
                </div>
            </div>
        </div>
    )
}