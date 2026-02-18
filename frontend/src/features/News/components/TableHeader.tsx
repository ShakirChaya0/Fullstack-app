import createNews from "../services/createNews";
import ModalNews from "./ModalNews";
import { ModalProvider } from "./NewsTable";
import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import { useFilter } from "../hooks/useFilter";



export default function TableHeader () {
    return (
        <>
            <h1 className="font-medium text-center md:text-left md:font-bold md:text-4xl">Gestor de Novedades</h1>
            <div className="flex gap-4 lg:gap-0 lg:flex-row flex-col items-center lg:justify-between w-full">
                <FilterBar />
                <ModalProvider fn={createNews} msgs={{SuccessMsg: "Novedad creada con éxito", ErrorMsg: "Error al crear la novedad"}} ButtonName="Crear Novedad">
                    <ModalNews />
                </ModalProvider>
            </div>
        </>
    )
}

function FilterBar (){
    const { filter, handleChangeFilter, query, isDebouncing, handleSearch} = useFilter()
    return (
        <>
            <form className="w-full max-w-sm xl:max-w-2xl flex xl:flex-row items-center md:items-baseline flex-col gap-5 md:self-start">
                <ButtonGroup variant="contained" className="w-fit">
                    <Button variant={filter === "Todas" ? "contained" : "outlined"} onClick={() => handleChangeFilter("Todas")}
                        sx= {{
                            textTransform:"none",
                            backgroundColor: filter === "Todas" ? "#0F766E" : "#fff",
                             color:  filter === "Todas" ? "#fff" : "#0F766E",
                             border: "#0F766E",
                             "&:active": {
                                backgroundColor: "#fff", 
                             },
                            "&:hover": {
                                backgroundColor: "#115E59",
                                color: "#fff"
                            },
                        }}
                    >
                        Todas
                    </Button>
                    <Button variant={filter === "Activas" ? "contained" : "outlined"} onClick={() => handleChangeFilter("Activas")}
                        sx= {{
                            textTransform:"none",
                            backgroundColor: filter === "Activas" ? "#0F766E" : "#fff",
                             color:  filter === "Activas" ? "#fff" : "#0F766E",
                             border: "#0F766E",
                             "&:active": {
                                backgroundColor: "#fff", 
                             },
                            "&:hover": {
                                backgroundColor: "#115E59",
                                color: "#fff"
                            },
                        }}
                        >
                        Activas
                    </Button>
                </ButtonGroup>
                <div className="flex flex-row gap-3 w-full">
                    <input value={query} type="text" className="bg-gray-200 w-full py-2 px-4 rounded-lg text-black outline-0" placeholder="Buscar por titulo" onChange={handleSearch}/>
                    { isDebouncing && query.length !== 0 && <CircularProgress size={32} />}
                </div>
            </form>
        </>
    )
}