import { useState } from "react"
import { Backdrop, Fade, Modal } from "@mui/material"

export default function ModalFreeTable({handleFreeTable} : {handleFreeTable: () => void}){
    const [open, setOpen] = useState(false)

    const handleOpen = () => { 
        setOpen(true)
    }

    const handleClose = () => setOpen(false)
    
    return (
            <div>
                <button 
                    onClick={handleOpen}
                    className={`w-full px-4 py-4 text-sm mt-5 font-medium text-white 
                    bg-amber-600 hover:bg-amber-700 active:scale-95 active:bg-amber-800 cursor-pointer
                    rounded-lg transition-all`}
                >
                    Liberar Mesa
                </button>
                <Modal
                    aria-labelledby="Crear Sugerencia"
                    aria-describedby="Formulario para crear una nueva sugerencia"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                    className='m-4'
                >
                
                    <Fade in={open}>
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                   bg-white w-[520px] rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="bg-orange-500 px-8 py-5">
                          <p className="text-white text-xl font-semibold">
                            Confirmación
                          </p>
                        </div>

                        <div className="px-8 py-8 text-center">
                          <p className="text-gray-800 text-lg font-medium">
                            ¿Estás seguro que desea liberar la mesa?
                          </p>

                          <p className="text-gray-600 mt-4 text-sm">
                            La mesa quedará disponible para ser ocupada nuevamente.
                          </p>
                        </div>

                        <div className="px-8 pb-8 flex justify-end gap-4">
                          <button
                            className="px-6 py-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 transition"
                            onClick={handleClose}
                          >
                            Cancelar
                          </button>

                          <button
                            className="px-6 py-2 rounded-md cursor-pointer bg-orange-500 text-white hover:bg-orange-600 transition"
                            onClick={() => {handleFreeTable();   handleClose()}}
                          >
                            Sí, liberar
                          </button>
                        </div>
                      </div>
                    </Fade>
                </Modal>
            </div>
    )
}   