import createNews from "../services/createNews";
import ModalNews from "./ModalNews";
import { ModalProvider } from "./NewsTable";

export default function TableHeader () {
    return (
        <div className="flex md:flex-row flex-col items-center sm:justify-between w-full">
            <h1 className="font-medium text-center md:text-left">Novedades</h1>
            <ModalProvider fn={createNews} msgs={{SuccessMsg: "Novedad creada con exito", ErrorMsg: "Error al crear la novedad"}} ButtonName="Crear Novedad">
                <ModalNews />
            </ModalProvider>
        </div>
    )
}