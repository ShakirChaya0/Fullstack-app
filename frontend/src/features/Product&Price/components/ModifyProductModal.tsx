import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, ToggleButton, ToggleButtonGroup, FormControlLabel, Checkbox, Typography, Alert } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { useRef, useState } from "react";
import GlutenFreeImg from '../utils/GlutenFree.png';
import VegetarianImg from '../utils/Vegetarian.png'
import VeganImg from '../utils/Vegan.png'
import SportsBarIcon from '@mui/icons-material/SportsBar';
import type { ProductPrice, ProductWithoutPrice } from "../interfaces/product&PriceInterfaces";
import { isValidProduct } from "../utils/isValidProduct";
import { isValidNameProduct } from "../utils/isValidNameProduct";
import { useMutationProductModification } from "../hooks/useMutationProducts";


export function ModifyProductModal({ 
    isOpen, 
    product, 
    existingProducts, 
    onClose,
    currentPage,
    limit
}: { 
    isOpen: boolean, 
    product: ProductPrice, 
    existingProducts: ProductPrice[], 
    onClose: () => void,
    currentPage?: number,
    limit?: number
}) { 
    //Guardando el valor original del producto
    const productBefModification = useRef<ProductWithoutPrice | null>(null);

    // Inicializar el valor original solo la primera vez
    if (productBefModification.current === null) {
        productBefModification.current = {
            idProducto: product.idProducto,
            nombre: product.nombre,
            descripcion: product.descripcion,
            estado: product.estado,
            esAlcoholica: product.esAlcoholica,
            tipo: product.tipo,
            esSinGluten: product.esSinGluten,
            esVegetariana: product.esVegetariana,
            esVegana: product.esVegana
        };
    }
    
    // Estado para manejar el error del formulario
    const [modalError, setModalError] = useState('')
    
    // Estados para el formulario
    const [newProduct, setNewProduct] = useState<ProductWithoutPrice>({
        idProducto: product.idProducto,
        nombre: product.nombre,
        descripcion: product.descripcion,
        estado: product.estado,
        esAlcoholica: product.esAlcoholica,
        tipo: product.tipo,
        esSinGluten: product.esSinGluten,
        esVegetariana: product.esVegetariana,
        esVegana: product.esVegana
    })

    const { modifyProductMutation } = useMutationProductModification({ 
        newProduct, 
        productBefModification, 
        setModalError, 
        onClose,
        currentPage,
        limit
    })

    const handleCloseModal = () => {
        onClose()
    }

    const handleSubmit = () => {
        if(!isValidProduct(newProduct, newProduct.tipo ? 'Comida' : 'Bebida')) {
            setModalError('Todos los campos deben ser completados')
            return
        }
        if(!isValidNameProduct(newProduct.nombre, existingProducts)) {
            setModalError('El nombre del nuevo producto ya existe')
            return
        }
        if(newProduct.nombre.length < 3) {
            setModalError('El nombre debe tener una longitud de más de 2 caracteres')
            return
        }
        if(newProduct.nombre.length > 255) {
            setModalError('El nombre no puede tener una longitud mayor a 255 caracteres')
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
        //Solo ejecuto el mutation si el producto cambio al menos un valor respecto al original  
        if(JSON.stringify(newProduct) === JSON.stringify(productBefModification.current)) {
            onClose()
            return 
        }
        modifyProductMutation.mutate()
    }

    return (
        <Dialog
            open={isOpen}
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
                <ModeEditIcon sx={{mb: "5px"}}/> Modificar Producto
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
                        Modifique lo que desee de su producto.
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                        Campos básicos <Typography variant="subtitle1" sx={{ color: 'red', display: 'inline'}}>*</Typography>
                    </Typography>

                    {/* Campos básicos */}
                    <div className="flex flex-col justify-between gap-4 mb-5">
                        <TextField
                            label="Nombre del Producto"
                            variant="outlined"
                            fullWidth
                            placeholder="Nombre de tu producto"
                            value={ newProduct.nombre }
                            onChange={(e) => {
                                setNewProduct(prev => {
                                    const productModify = {...prev}
                                    const newName = e.target.value
                                    productModify.nombre = newName
                                    return productModify;
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
                            value={newProduct.descripcion}
                            onChange={(e) => {
                                setNewProduct(prev => {
                                    const productModify = {...prev}
                                    const newDescription = e.target.value
                                    productModify.descripcion = newDescription
                                    return productModify;
                                });
                            }}
                        />
                    </div>

                    {/* Manejo Disponibilidad */}
                    <div className="w-full mb-4">
                        <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Disponiblidad <Typography variant="subtitle1" sx={{ color: 'red', display: 'inline'}}>*</Typography>
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
                            Tipo de producto <Typography variant="subtitle1" sx={{ color: 'red', display: 'inline'}}>*</Typography>
                        </Typography>
                        <ToggleButtonGroup
                            value={product.tipo ? 'Comida' : 'Bebida'}
                            exclusive
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
                            <ToggleButton value="Comida" disabled={product.tipo === undefined} className="flex items-center">
                                <RestaurantIcon />
                                <span className="ml-1">Comida</span>
                            </ToggleButton>
                            <ToggleButton value="Bebida" disabled={product.tipo !== undefined} className="flex items-center">
                                <LocalBarIcon />
                                <span className="ml-1">Bebida</span>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    <div className="flex flex-col w-[98%] border-2 border-gray-300 rounded-2xl m-auto py-2 px-4">
                        <Typography variant="subtitle1" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Características de la {product.tipo ? `comida ${<Typography variant="subtitle1" sx={{ color: 'red', display: 'inline'}}>*</Typography>}` : 'bebida'} 
                        </Typography>

                        {product.tipo ? (
                            <div className="flex flex-col gap-2">
                                {/* Tipo de plato */}
                                <div className="flex">
                                    <ToggleButtonGroup
                                        value={ newProduct.tipo }
                                        exclusive
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
                                                        checked={ newProduct.esSinGluten }
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
                                                        checked={ newProduct.esVegetariana }
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
                                                        checked={ newProduct.esVegana }
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
                            // Bebida - solo checkbox alcohólica
                            <div className="flex flex-row">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={ newProduct.esAlcoholica }
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
                        )}
                    </div> {/* Agregar Disponibilidad del producto */}
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
                    Modificar Producto
                </Button>
            </DialogActions>
        </Dialog>
    )
}



