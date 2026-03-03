import { useState } from "react"
import { Backdrop, Fade, Modal } from "@mui/material"

export default function ModalFreeTable({ handleFreeTable }: { handleFreeTable: () => void }) {
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
        aria-labelledby="Confirmación de liberación"
        aria-describedby="Formulario para liberar la mesa"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="flex items-center justify-center" 
      >
        <Fade in={open}>
          <div
            className="relative bg-white w-[90%] max-w-[520px] rounded-xl shadow-2xl overflow-hidden outline-none"
          >
            <div className="bg-orange-500 px-6 sm:px-8 py-4 sm:py-5">
              <p className="text-white text-lg sm:text-xl font-semibold">
                Confirmación
              </p>
            </div>

            <div className="px-6 sm:px-8 py-6 sm:py-8 text-center">
              <p className="text-gray-800 text-base sm:text-lg font-medium">
                ¿Estás seguro que desea liberar la mesa?
              </p>

              <p className="text-gray-600 mt-3 sm:mt-4 text-xs sm:text-sm">
                La mesa quedará disponible para ser ocupada nuevamente.
              </p>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                className="order-2 sm:order-1 px-6 py-2.5 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 transition text-sm sm:text-base font-medium"
                onClick={handleClose}
              >
                Cancelar
              </button>

              <button
                className="order-1 sm:order-2 px-6 py-2.5 rounded-md cursor-pointer bg-orange-500 text-white hover:bg-orange-600 transition text-sm sm:text-base font-medium"
                onClick={() => {
                  handleFreeTable();
                  handleClose();
                }}
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