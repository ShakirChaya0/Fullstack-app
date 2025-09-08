import { CircularProgress } from "@mui/material"
import { useSearchProvider } from "../hooks/useSearchProvider"
import createWaiter from "../services/createWaiter"
import ModalWaiters from "./ModalWaiters"
import { ModalProvider } from "./WaitersTable"

export default function WaitersHeader () {
    return (
        <>
            <h1 className="font-medium text-center md:text-left">Mozos</h1>
            <div className="flex gap-4 lg:gap-0 lg:flex-row flex-col items-center lg:justify-between w-full">
                <FilterBar />
                <ModalProvider fn={createWaiter} msgs={{SuccessMsg: "Mozo creado con exito", ErrorMsg: "Error al crear un mozo"}} ButtonName={"Crear Mozo"}>
                    <ModalWaiters/>
                </ModalProvider>
            </div>
        </>
    )
}

function FilterBar (){
    const { query, isDebouncing, handleSearch} = useSearchProvider()
    return (
        <>
            <form className="w-full max-w-sm xl:max-w-2xl flex xl:flex-row items-center md:items-baseline flex-col gap-5 md:self-start">
                <div className="flex flex-row gap-3 w-full">
                    <input type="text" value={query} className="bg-gray-200 w-full py-2 px-4 rounded-lg text-black outline-0" placeholder="Buscar por nombre de usuario" onChange={handleSearch}/>
                    { isDebouncing && query.length !== 0 && <CircularProgress size={32} />}
                </div>
            </form>
        </>
    )
}