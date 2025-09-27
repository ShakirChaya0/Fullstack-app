import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useMutationDeletePrice } from "../hooks/useMutationPrice";
import type { DeleteConfirmationModalProps } from "../interfaces/product&PriceInterfaces";
import { toast } from "react-toastify";


export function DeleteConfirmationModal({ idProducto, selectedPrice, amountPrices}: DeleteConfirmationModalProps ) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalError, setModalError] = useState('')

    const { deletePriceMutation } = useMutationDeletePrice({ idProducto, selectedPrice, setIsModalOpen })

    useEffect(() => {
        const handleOpenModal = () => {
            setIsModalOpen(true);
        };

        // Escuchar el evento personalizado para abrir la modal
        window.addEventListener('openPriceDeleteModal', handleOpenModal);

        // Limpiar el evento
        return () => {
            window.removeEventListener('openPriceDeleteModal', handleOpenModal);
        };
    }, []);

    const handleCloseModal = () => {
        setModalError('')
        setIsModalOpen(false)
    }

    const handleDeletePrice = () => {
        if (!selectedPrice) return
        if (amountPrices === 1) {
            toast.error('No se puede eliminar el único precio del producto')
            return
        }
        deletePriceMutation.mutate()
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
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: 'black',
            }}>
                Confirmar eliminación de precio
                { modalError && 
                    <Alert severity="error">
                        { modalError }
                    </Alert>
                }
            </DialogTitle>
            
            <DialogContent>
                <div className="flex flex-col justify-between">
                    <Alert severity="warning">
                        ¿Desea confirma la eliminación del siguiente precio?
                    </Alert>

                    {/* Campos básicos */}
                    <div className="flex flex-col justify-center gap-4 mt-5">
                        <Typography variant="h6" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Producto: <p className="inline font-bold">{selectedPrice?.producto ?`${selectedPrice?.producto.idProducto} - ${selectedPrice.producto.nombre}`: 'Producto no identificado'}</p>
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Fecha Vigencia desde: <p className="inline font-bold">{selectedPrice?.fechaVigencia.slice(0,10) || 'No seleccionado'}</p>
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Monto: <p className="inline font-bold">${selectedPrice?.monto || 0}</p>
                        </Typography>
                    </div>
                </div>
            </DialogContent>
            <DialogActions sx={{ padding: '0.5rem 1rem', mt: '0.5rem', backgroundColor: '#e5e7eb', borderRadius: '5px'}}>
                <Button 
                    onClick={handleCloseModal}
                    variant="outlined"
                    sx={{ 
                        borderColor: '#6b7280',
                        color: '#6b7280',
                        '&:hover': {
                            borderColor: '#374151',
                            backgroundColor: '#6a7282',
                            color: 'white'
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleDeletePrice}
                    variant="contained"
                    disabled={!selectedPrice}
                    sx={{ 
                        backgroundColor: '#e7000b',
                        '&:hover': { backgroundColor: '#9f0712' },
                        '&:disabled': { backgroundColor: '#9ca3af', color: '#6b7280' }
                    }}
                >
                    Eliminar Precio
                </Button>
            </DialogActions>
        </Dialog>  
    )
}