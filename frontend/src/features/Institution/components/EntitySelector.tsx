
export default function EntitySelector() {
    return(
        <div className="flex flex-row gap-5">
            <button className="w-full max-w-40 sm:min-w-40  px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer">Políticas</button>
            <button className="w-full max-w-40 sm:min-w-40  px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer">Información</button>
        </div>

        // <div className="flex flex-row gap-5">
        //     <ButtonGroup
        //     disableElevation
        //     variant="contained"
        //     aria-label="Disabled button group"
        //     >
        //     <Button>Políticas</Button>
        //     <Button>Información</Button>
        //     </ButtonGroup>
        // </div>
    )
}