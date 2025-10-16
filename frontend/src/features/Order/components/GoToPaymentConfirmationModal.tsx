import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../shared/hooks/store";
import { OrderTotalAmount } from "../../Products/utils/OrderTotalAmount";
import { toast } from "react-toastify";


export function PaymentConfirmationModal() {
    const order = useAppSelector((state) => state.order)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleOpenModal = () => {
            setIsModalOpen(true);
        };

        // Escuchar el evento personalizado para abrir la modal
        window.addEventListener('openPaymentConfirmationModal', handleOpenModal);

        // Limpiar el evento
        return () => {
            window.removeEventListener('openPaymentConfirmationModal', handleOpenModal);
        };
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleConfirmation = () => {
        if(order.estado !== 'Completado') {
            toast.error('El pedido aún no está completado')
            return
        }

        // URL que dispare CUU pagar Pedido
        navigate('/Cliente/Pedido/Cuenta', {replace: true})
    }

    return (
        <Dialog
            open={isModalOpen}
            onClose={handleCloseModal}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '10px',
                        padding: '8px'
                    }
                },
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(4px)' // Para difuminar el fondo
                    }
                }
            }}
        >
            <DialogTitle sx={{ 
                fontSize: '1.3rem', 
                fontWeight: 'bold',
                color: 'black',
                display: 'flex',
                justifyContent: 'center'
            }}>
                ¿Proceder con el pago?
            </DialogTitle>
            
            <DialogContent>
                <div className="flex flex-col">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg text-left text-sm mb-6">
                        <p><strong>Atención:</strong> Si confirma, no se podrá volver ni modificar su orden.</p>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total a pagar antes de impuestos:</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">${OrderTotalAmount(order.lineasPedido).toFixed(2)}</p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <div className="flex flex-row w-full gap-3">
                    <button 
                        className="w-full flex justify-center items-center px-6 py-3 border
                        border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-100 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors cursor-pointer"
                        onClick={handleCloseModal}    
                    >
                        Cancelar
                    </button>
                    <button 
                        className="
                            w-full flex justify-center items-center px-6 py-1 
                            border border-transparent text-base font-semibold rounded-xl shadow-md
                            text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 
                            focus:ring-offset-2 focus:ring-green-500 transition-transform transform active:scale-95 cursor-pointer
                            "
                        onClick={handleConfirmation}
                    >
                        Pagar Pedido
                    </button>
                </div>
            </DialogActions>
        </Dialog>  
    )
}