import { useCallback, useState } from "react";
import { Backdrop, Fade, Modal } from "@mui/material";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { CreditCardIcon } from "./IconComponents";

export default function PaymentMethodModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleClose = useCallback(() => setIsOpen(false), []);
    
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center bg-[var(--primary-100)] hover:bg-orange-600 cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-all duration-100 active:scale-95 active:bg-orange-700"
            >
                <CreditCardIcon />
                Proceder al Pago
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
                        <PaymentMethodSelector onClose={handleClose} />
                    </div>
                </Fade>
            </Modal>
        </>
    )
}                