import { useCallback, useState } from "react";
import { Backdrop, Fade, Modal } from "@mui/material";
import type { ITable } from "../interfaces/ITable";
import PaymentMethodSelector from "./PaymentMethodSelect";

export default function SelectMethodModal({currentTable}: {currentTable: ITable}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleClose = useCallback(() => setIsOpen(false), []);

    return (
        <>
            <button 
              onClick={() => {setIsOpen(true); console.log("sakdjhbaskjdhb")}}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-teal-600 
              rounded-lg hover:bg-teal-700 active:scale-95 active:bg-teal -800 cursor-pointer transition-all"
            >
              Cobrar Pedido
            </button>
            <Modal
                aria-labelledby="Seleccionar método de pago"
                aria-describedby="Formulario para seleccionar el método de pago"
                open={isOpen}
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
                <Fade in={isOpen}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-2xl">
                        <PaymentMethodSelector onClose={handleClose} currentTable={currentTable}/>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}          