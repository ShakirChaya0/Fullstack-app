import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useMutationPriceRegistration } from "../hooks/useMutationPrice";
import { getCurrentDate } from "../utils/getCurrentDate";
import type { PriceList } from "../interfaces/product&PriceInterfaces";
import { isValidPrice } from "../utils/isValidPrice";


export function NewPriceModal({ idProducto, preciosRegistrados }: { idProducto: string, preciosRegistrados: PriceList[]}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalError, setModalError] = useState('')
    const [newPrice, setNewPrice] = useState({
        idProducto: idProducto,
        monto: 0,
    })

    const { savePriceMutation } = useMutationPriceRegistration({ newPrice, setNewPrice, setModalError, setIsModalOpen })

    useEffect(() => {
        const handleOpenModal = () => {
            setIsModalOpen(true);
        };

        // Escuchar el evento personalizado para abrir la modal
        window.addEventListener('openPriceRegistrationModal', handleOpenModal);

        // Limpiar el evento
        return () => {
            window.removeEventListener('openPriceRegistrationModal', handleOpenModal);
        };
    }, []);

    const handleCloseModal = () => {
        setNewPrice(prev => ({
            ...prev,
            monto: 0
        }))
        setModalError('')
        setIsModalOpen(false)
    }

    const handleSubmitNewPrice = () => {
        if(!isValidPrice(preciosRegistrados)) {
            setModalError('Ya existe un precio registrado para la fecha de hoy. Si desea registrar otro elimine el ya existente o espere un día')
            return
        }
        if(!newPrice.monto) {
            setModalError('Campo precio incompleto')
            return
        }
        if(newPrice.monto <= 0 ) {
            setModalError('El precio debe tener un valor válido')
            return
        }
        savePriceMutation.mutate()
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
                Registrar Nuevo Precio
                { modalError && 
                    (
                        <Alert severity="error">
                            { modalError }
                        </Alert>
                    )}
            </DialogTitle>
            
            <DialogContent>
                <div className="flex flex-col">
                    <Typography variant="h6" sx={{ color: '#4a5565', mb:'1rem' }}>
                        Recuerde que el último precio registrado será el que se visualizará en el menú.
                    </Typography>

                    {/* Campos básicos */}
                    <div className="flex flex-col justify-center gap-4 mb-5">
                        <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Precio - Fecha Vigencia desde: <p className="inline font-bold">{ getCurrentDate() }</p>
                        </Typography>
                        <TextField
                            label="Precio"
                            type="text"
                            variant="outlined"
                            fullWidth
                            placeholder="0,00"
                            onChange={(e) => {
                                setNewPrice(prev => {
                                    const newProduct = {...prev}
                                    if(e.target.value.indexOf(',') !== -1 && e.target.value.indexOf("-") === e.target.value.lastIndexOf("-")) { //Validando que tenga un formato correcto
                                        const newValue = e.target.value.replace(',','.')
                                        const newPrice = !isNaN(parseFloat(newValue)) ? parseFloat(newValue) : 0
                                        newProduct.monto = newPrice
                                        return newProduct
                                    }
                                    const newPrice = !isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : 0
                                    newProduct.monto = newPrice;
                                    return newProduct;
                                });
                            }}
                            onBlur={(e) => { // Solución al problema estético del input: aplicar el formateo al perder el foco en otro lado no con el onBlur
                                // Formatear a 2 decimales cuando pierde el foco
                                const value = parseFloat(e.target.value.indexOf(',') !== -1 ? e.target.value.replace(',','.') : e.target.value) || 0
                                const formatted = value.toFixed(2)
                                e.target.value = formatted
                                
                                setNewPrice(prev => ({
                                    ...prev,
                                    precio: parseFloat(formatted)
                                }));
                            }}
                        />
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
                    onClick={handleSubmitNewPrice}
                    variant="contained"
                    sx={{ 
                        backgroundColor: '#059669',
                        '&:hover': { backgroundColor: '#047857' }
                    }}
                >
                    Registrar Precio
                </Button>
            </DialogActions>
        </Dialog>  
    )
}