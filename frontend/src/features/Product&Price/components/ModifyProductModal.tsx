import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, ToggleButton, ToggleButtonGroup, FormControlLabel, Checkbox, Typography } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { useState } from "react";
import GlutenFreeImg from '../utils/GlutenFree.png';
import VegetarianImg from '../utils/Vegetarian.png'
import VeganImg from '../utils/Vegan.png'
import SportsBarIcon from '@mui/icons-material/SportsBar';
import type { ProductPrice } from "../interfaces/product&PriceInterfaces";


export function ModifyProductModal({ isOpen, product, onClose}: { isOpen: boolean, product: ProductPrice, onClose: () => void }) { 
    
    // Estados para el formulario
    const [newProduct, setNewProduct] = useState<ProductPrice>({
        idProducto: product.idProducto,
        nombre: product.nombre,
        descripcion: product.descripcion,
        estado: product.estado,
        precio: product.precio,
        esAlcoholica: product.esAlcoholica,
        tipo: product.tipo,
        esSinGluten: product.esSinGluten,
        esVegetariana: product.esVegetariana,
        esVegana: product.esVegana
    })

    const [foodType, setFoodType] = useState(product.tipo ? product.tipo : ''); // 'Entrada', 'Plato_Principal', 'Postre'
    const [isSinGluten, setIsSinGluten] = useState(product.esSinGluten ? true : false);
    const [isVegetariana, setIsVegetariana] = useState(product.esVegetariana ? true : false);
    const [isVegana, setIsVegana] = useState(product.esVegana ? true : false);
    const [isAlcoholica, setIsAlcoholica] = useState(product.esAlcoholica ? true : false);

    const handleCloseModal = () => {
        onClose()
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
            </DialogTitle>
            
            <DialogContent>
                <div className="flex flex-col">
                    <Typography variant="h6" sx={{ color: '#4a5565', mb:'1rem' }}>
                        Modifique lo que desee de su producto.
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
                        <TextField
                            label="Precio"
                            variant="outlined"
                            type="number"
                            fullWidth
                            placeholder="0.00"
                            value={newProduct.precio}
                            onChange={(e) => {
                                setNewProduct(prev => {
                                    const productModify = {...prev}
                                    const newPrice = parseFloat(e.target.value)
                                    productModify.precio = newPrice
                                    return productModify;
                                });
                            }}
                        />
                    </div>

                    {/* Manejo Disponibilidad */}
                    <div className="w-full mb-4">
                        <Typography variant="subtitle2" sx={{ color: '#4a5565', mb:'0.5rem' }}>
                            Disponiblidad
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
                            Tipo de producto
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
                            Características de la {product.tipo ? 'comida' : 'bebida'}
                        </Typography>

                        {product.tipo ? (
                            <div className="flex flex-col gap-2">
                                {/* Tipo de plato */}
                                <div className="flex">
                                    <ToggleButtonGroup
                                        value={foodType}
                                        exclusive
                                        onChange={(_, newValue) => newValue && setFoodType(newValue)}
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
                                                        checked={isSinGluten}
                                                        onChange={(e) => setIsSinGluten(e.target.checked)}
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
                                                        checked={isVegetariana}
                                                        onChange={(e) => setIsVegetariana(e.target.checked)}
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
                                                        checked={isVegana}
                                                        onChange={(e) => setIsVegana(e.target.checked)}
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
                                            checked={isAlcoholica}
                                            onChange={(e) => setIsAlcoholica(e.target.checked)}
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
                    onClick={handleCloseModal}
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



