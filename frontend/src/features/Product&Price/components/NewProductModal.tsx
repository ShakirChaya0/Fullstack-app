import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControlLabel, Checkbox, Typography, Alert } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from "react";
import type { ProductPriceWithoutID } from "../interfaces/product&PriceInterfaces";
import { useMutationProductRegistration } from "../hooks/useMutationProducts";
import type { ProductType } from "../types/product&PriceTypes";
import { isValidProduct } from "../utils/isValidProduct";
import { ProductTogglerRegistration } from "./ProductTogglerRegistration";

export function NewProductModal() {
    // NewProductModal maneja su estado de manera interna
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Estado para errores del formulario
    const [modalError, setModalError] = useState('')
    
    // Estados para el formulario
    const [newProduct, setNewProduct] = useState<ProductPriceWithoutID>({
        nombre: '',
        descripcion: '',
        estado: 'Disponible',
        precio: 0,
        esAlcoholica: undefined,
        tipo: undefined,
        esSinGluten: undefined,
        esVegetariana: undefined,
        esVegana: undefined
    })
    const [productType, setProductType] = useState<ProductType | undefined>(undefined)

    const { saveProductMutation } = useMutationProductRegistration({ newProduct, setNewProduct, setProductType, setModalError, setIsModalOpen })

    useEffect(() => {
        const handleOpenModal = () => {
            setIsModalOpen(true);
        };

        // Escuchar el evento personalizado para abrir la modal
        window.addEventListener('openNewProductModal', handleOpenModal);

        // Limpiar el evento
        return () => {
            window.removeEventListener('openNewProductModal', handleOpenModal);
        };
    }, []);

    const handleCloseModal = () => {
        setNewProduct({
            nombre: '',
            descripcion: '',
            estado: 'Disponible',
            precio: 0,
            esAlcoholica: undefined,
            tipo: undefined,
            esSinGluten: undefined,
            esVegetariana: undefined,
            esVegana: undefined
        })
        setProductType(undefined)
        setModalError('')
        setIsModalOpen(false)
    }

    const handleSubmit = () => {
        if(!isValidProduct(newProduct, productType)) {
            setModalError('Todos los campos deben ser completados')
            return
        }
        if(newProduct.precio < 0) {
            setModalError('El precio no puede ser negativo')
            return
        }
        if(newProduct.nombre.length < 3) {
            setModalError('El nombre debe tener una longitud de más de 2 caracteres')
            return
        }
        if(newProduct.nombre.length > 30) {
            setModalError('El nombre no puede tener una longitud mayor a 30 caracteres')
            return
        }
        if(newProduct.descripcion.length < 10) {
            setModalError('La descripcion debe tener una longitud de más de 10 caracteres')
            return
        }
        if(newProduct.descripcion.length > 255) {
            setModalError('La nombre debe tener una longitud de más de 2 caracteres')
            return
        }
        if(newProduct.precio === 0) {
            setModalError('El precio debe tener un valor válido')
            return
        }
        saveProductMutation.mutate()
    }

    return (
        <Dialog
            open={isModalOpen}
            onClose={handleCloseModal}
            maxWidth="md"
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
                <AddCircleIcon sx={{mb: "5px"}}/> Crear Nuevo Producto
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
                        Complete los siguientes campos para crear un nuevo producto en su menú.
                    </Typography>

                    {/* Campos básicos */}
                    <div className="flex flex-col justify-between gap-4 mb-5">
                        <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Campos básicos <Typography variant="h6" sx={{ color: 'red', display: 'inline'}}>*</Typography>
                        </Typography>
                        <TextField
                            label="Nombre del Producto"
                            variant="outlined"
                            fullWidth
                            placeholder="Ej: Salmón a la Parrilla"
                            slotProps={{
                                htmlInput: { maxLength: 30}
                            }}
                            onChange={(e) => {
                                if (e.currentTarget.value.trim() == '') {
                                    e.currentTarget.value = ''
                                    return
                                }  
                                if(modalError) setModalError('')
                                setNewProduct(prev => {
                                    const newProduct = {...prev}
                                    const newName = e.target.value
                                    newProduct.nombre = newName
                                    return newProduct;
                                });
                            }}
                        />
                        <TextField
                            label="Descripción"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Describe tu producto..."
                            onChange={(e) => {
                                if (e.currentTarget.value.trim() == '') {
                                    e.currentTarget.value = ''
                                    return
                                }  
                                if(modalError) setModalError('')
                                setNewProduct(prev => {
                                    const newProduct = {...prev}
                                    const newDescription = e.target.value
                                    newProduct.descripcion = newDescription
                                    return newProduct;
                                });
                            }}
                        />
                        <TextField
                            label="Precio"
                            variant="outlined"
                            fullWidth
                            placeholder="0,00"
                            onChange={(e) => {
                                if(modalError) setModalError('')
                                setNewProduct(prev => {
                                    const newProduct = {...prev}
                                    if(e.target.value.indexOf(',') !== -1 && e.target.value.indexOf("-") === e.target.value.lastIndexOf("-")) { //Validando que tenga un formato correcto
                                        const newValue = e.target.value.replace(',','.')
                                        const newPrice = !isNaN(parseFloat(newValue)) ? parseFloat(newValue) : 0
                                        newProduct.precio = newPrice
                                        return newProduct
                                    }
                                    const newPrice = !isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : 0
                                    newProduct.precio = newPrice;
                                    return newProduct;
                                });
                            }}
                            onBlur={(e) => {
                                // Formatear a 2 decimales cuando pierde el foco
                                const value = parseFloat(e.target.value.indexOf(',') !== -1 ? e.target.value.replace(',','.') : e.target.value) || 0
                                const formatted = value.toFixed(2)
                                e.target.value = formatted
                                
                                setNewProduct(prev => ({
                                    ...prev,
                                    precio: parseFloat(formatted)
                                }));
                            }}
                        />
                    </div>
                    
                    {/* Manejo Disponibilidad */}
                    <div className="w-full mb-4">
                        <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Disponiblidad <Typography variant="h6" sx={{ color: 'red', display: 'inline'}}>*</Typography>
                        </Typography>
                        <div className="flex flex-row justify-around">
                            <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={ newProduct.estado === 'Disponible' }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setNewProduct(prev => ({
                                                        ...prev,
                                                        estado: 'Disponible'
                                                    }));
                                                }
                                            }}
                                            sx={{
                                                color: '#6b7280',
                                                '&.Mui-checked': {
                                                    color: '#009689',
                                                }
                                            }}
                                        />
                                    }
                                    label="Disponible"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={newProduct.estado === 'No_Disponible'}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setNewProduct(prev => ({
                                                        ...prev,
                                                        estado: 'No_Disponible'
                                                    }));
                                                }
                                            }}
                                            sx={{
                                                color: '#6b7280',
                                                '&.Mui-checked': {
                                                    color: '#009689',
                                                }
                                            }}
                                        />
                                    }
                                    label="No Disponible"
                                />
                        </div>
                    </div>
                    
                    <ProductTogglerRegistration 
                        productType={productType} setProductType={setProductType} 
                        newProduct={newProduct} setNewProduct={setNewProduct}
                    ></ProductTogglerRegistration>
                    
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
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ 
                        backgroundColor: '#059669',
                        '&:hover': { backgroundColor: '#047857' }
                    }}
                >
                    Crear Producto
                </Button>
            </DialogActions>
        </Dialog>
    )
}