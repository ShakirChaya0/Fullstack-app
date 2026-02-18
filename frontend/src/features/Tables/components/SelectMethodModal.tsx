import { useCallback, useState } from "react";
import { Backdrop, Fade, Modal } from "@mui/material";
import PaymentMethodSelector from "./PaymentMethodSelect";
import { useLocation, useNavigate } from "react-router";

export default function SelectMethodModal({currentTable}: {currentTable: number | undefined }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate()
    const location = useLocation();
    const handleClose = useCallback(() =>{ 
        if (location.pathname.includes("Cuenta")) {
            navigate("/Mozo/Mesas")
        }
        else {
            setIsOpen(false)
        }
    }, []);

    return (
        <>
            <button 
              onClick={() => {setIsOpen(true);}}
              className="w-full px-4 py-3 text-sm font-bold text-white bg-orange-600 
              rounded-lg hover:bg-orange-700 active:scale-95 active:bg-orange-800 cursor-pointer transition-all"
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