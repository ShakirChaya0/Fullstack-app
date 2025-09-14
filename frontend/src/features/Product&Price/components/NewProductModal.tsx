import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, ToggleButton, ToggleButtonGroup, FormControlLabel, Checkbox, Typography, Alert } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { useEffect, useState } from "react";
import GlutenFreeImg from '../utils/GlutenFree.png';
import VegetarianImg from '../utils/Vegetarian.png'
import VeganImg from '../utils/Vegan.png'
import SportsBarIcon from '@mui/icons-material/SportsBar';
import type { ProductPrice, ProductPriceWithoutID } from "../interfaces/product&PriceInterfaces";
import { useMutationProductRegistration } from "../hooks/useMutationProducts";
import { isValidProduct } from "../utils/isValidProduct";
import { isValidNameProduct } from "../utils/isValidNameProduct";
import type { ProductType } from "../types/product&PriceTypes";

export function NewProductModal({ existingProducts }: { existingProducts: ProductPrice[]}) {
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
        if(!isValidNameProduct(newProduct.nombre, existingProducts)) {
            setModalError('El nombre del nuevo producto ya existe')
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
                            onChange={(e) => {
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
                            type="number"
                            fullWidth
                            placeholder="0.00"
                            slotProps={{
                                htmlInput: {
                                    min: 0
                                }
                            }}
                            onChange={(e) => {
                                setNewProduct(prev => {
                                    const newProduct = {...prev}
                                    const parsedValue = parseFloat(e.target.value);
                                    const newPrice = !isNaN(parsedValue) ? parsedValue : 0;
                                    newProduct.precio = newPrice;
                                    return newProduct;
                                });
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

                    {/* Toggle para tipo de producto */}
                    <div className="w-full mb-4">
                        <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Tipo de producto <Typography variant="h6" sx={{ color: 'red', display: 'inline'}}>*</Typography>
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={ productType }
                            onChange={(_, newValue) => setProductType(newValue)}
                            fullWidth
                            sx={{
                                display: 'flex',
                                '& .MuiToggleButton-root': {
                                    flex: 1,
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    '&:first-of-type': {
                                        marginRight: '8px',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#009689',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#007b70',
                                        }
                                    }
                                }
                            }}
                        >
                            <ToggleButton value="Comida" className="flex items-center">
                                <RestaurantIcon />
                                <span className="ml-1">Comida</span>
                            </ToggleButton>
                            <ToggleButton value="Bebida" className="flex items-center">
                                <LocalBarIcon />
                                <span className="ml-1">Bebida</span>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    { productType &&
                        <div className="flex flex-col w-[98%] border-2 border-gray-300 rounded-2xl m-auto py-2 px-4">
                            
                            {productType === 'Comida' ? (
                                <div className="flex flex-col gap-2">
                                    <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                                        Características de la {productType.toLowerCase()} <Typography variant="subtitle1" sx={{ color: 'red', display: 'inline'}}>*</Typography> 
                                    </Typography>
                                    {/* Tipo de plato */}
                                    <div className="flex">
                                        <ToggleButtonGroup
                                            exclusive
                                            value={ newProduct.tipo }
                                            onChange={(_, newValue) => newValue && 
                                                setNewProduct(prev => {
                                                    const newProduct = {...prev}
                                                    const newType = newValue
                                                    newProduct.tipo = newType
                                                    return newProduct;
                                                })
                                            }
                                            fullWidth
                                            sx={{
                                                display: 'flex',
                                                flexDirection: {
                                                    xs: 'column',
                                                    md: 'row'
                                                },
                                                gap: '8px',
                                                '& .MuiToggleButton-root': {
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#0BA6DF',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: '#0891b2',
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            <ToggleButton value="Entrada">Entrada</ToggleButton>
                                            <ToggleButton value="Plato_Principal">Plato Principal</ToggleButton>
                                            <ToggleButton value="Postre">Postre</ToggleButton>
                                        </ToggleButtonGroup>
                                    </div>

                                    <div>
                                        <Typography variant="subtitle2" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                                            Especificaciones
                                        </Typography>
                                        <div className="flex flex-row justify-around">
                                            <div className="flex flex-row">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                        onChange={(e) =>
                                                            setNewProduct(prev => {
                                                                const newProduct = {...prev}
                                                                const newGlutenFree = e.target.checked
                                                                newProduct.esSinGluten = newGlutenFree
                                                                return newProduct;
                                                            })
                                                        }
                                                            sx={{
                                                                color: '#6b7280',
                                                                '&.Mui-checked': {
                                                                    color: '#009689',
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label="Sin Gluten"
                                                    className="text-gray-700"
                                                />
                                                <img
                                                    src={GlutenFreeImg}
                                                    alt="Gluten Free"
                                                    className="w-10 h-10"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex flex-row">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            onChange={(e) =>
                                                                setNewProduct(prev => {
                                                                    const newProduct = {...prev}
                                                                    const newVegetarian = e.target.checked
                                                                    newProduct.esVegetariana = newVegetarian
                                                                    return newProduct;
                                                                })
                                                            }
                                                            sx={{
                                                                color: '#6b7280',
                                                                '&.Mui-checked': {
                                                                    color: '#009689',
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label="Vegetariana"
                                                    className="text-gray-700"
                                                />
                                                <img
                                                    src={VegetarianImg}
                                                    alt="Vegetariana"
                                                    className="w-10 h-10"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex flex-row">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            onChange={(e) =>
                                                                setNewProduct(prev => {
                                                                    const newProduct = {...prev}
                                                                    const newVegan = e.target.checked
                                                                    newProduct.esVegana = newVegan
                                                                    return newProduct;
                                                                })
                                                            }
                                                            sx={{
                                                                color: '#6b7280',
                                                                '&.Mui-checked': {
                                                                    color: '#009689',
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label="Vegana"
                                                    className="text-gray-700"
                                                />
                                                <img
                                                    src={VeganImg}
                                                    alt="Vegana"
                                                    className="w-10 h-10"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Bebida 
                                <>
                                    <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                                        Características de la {productType.toLowerCase()} <Typography variant="subtitle1" sx={{ color: 'red', display: 'inline'}}>*</Typography> 
                                    </Typography>
                                    <div className="flex flex-row mt-2">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value={ newProduct.esAlcoholica }
                                                    onChange={(e) =>
                                                        setNewProduct(prev => {
                                                            const newProduct = {...prev}
                                                            const newIsAlcoholic = e.target.checked
                                                            newProduct.esAlcoholica = newIsAlcoholic
                                                            return newProduct;
                                                        })
                                                    }
                                                    sx={{
                                                        color: '#6b7280',
                                                        '&.Mui-checked': {
                                                            color: '#009689',
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Bebida Alcohólica"
                                            className="text-gray-700"
                                        />
                                        <SportsBarIcon fontSize="large"/>
                                    </div>                        
                                </>
                            )}                             
                        </div>
                    }
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