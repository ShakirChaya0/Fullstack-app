import { Checkbox, FormControlLabel, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { ProductPriceWithoutID } from "../interfaces/product&PriceInterfaces";
import type { ProductType } from "../types/product&PriceTypes";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import GlutenFreeImg from '../utils/GlutenFree.png';
import VegetarianImg from '../utils/Vegetarian.png'
import VeganImg from '../utils/Vegan.png'
import SportsBarIcon from '@mui/icons-material/SportsBar';


export function ProductTogglerRegistration({ productType, setProductType, newProduct, setNewProduct}:
    {   productType: ProductType | undefined, 
        setProductType: (value: React.SetStateAction<ProductType | undefined>) => void, 
        newProduct: ProductPriceWithoutID, 
        setNewProduct: (value: React.SetStateAction<ProductPriceWithoutID>) => void
    }   
) {

    return (
        <>
            {/* Toggle para tipo de producto */}
            <div className="flex flex-col w-full mb-4">
                <Typography variant="subtitle1" sx={{ color: '#1e2939', mb:'0.5rem' }}>
                    Tipo de producto <Typography variant="h6" sx={{ color: 'red', display: 'inline'}}>*</Typography>
                </Typography>
                <div className="flex flex-col">
                    <ToggleButtonGroup
                        exclusive
                        value={ productType }
                        onChange={(_, newValue) => {
                            if (newValue === 'Comida') {
                                setNewProduct(prev => ({
                                    ...prev,
                                    esAlcoholica: undefined
                                }));
                            }
                            if (newValue === 'Bebida') {
                                setNewProduct(prev => ({
                                    ...prev,
                                    tipo: undefined,
                                    esSinGluten: undefined,
                                    esVegetariana: undefined,
                                    esVegana: undefined
                                }));
                            }

                            setProductType(newValue)
                        }}
                        fullWidth
                        sx={{
                            display: 'flex',
                            gap: {
                                xs: '0.5rem',
                                md: '0rem'
                            },
                            flexDirection: {
                                xs: 'column',
                                md: 'row'
                            },
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
            </div>

            { productType &&
                <div className="flex flex-col w-[98%] border-2 border-gray-300 rounded-2xl m-auto py-2 px-4">
                    
                    {productType === 'Comida' ? (
                        <div className="flex flex-col gap-2">
                            <Typography variant="subtitle1" sx={{ color: '#1e2939', mb:'0.5rem' }}>
                                Características de la {productType.toLowerCase()} <Typography variant="subtitle1" sx={{ color: 'red', display: 'inline'}}>*</Typography> 
                            </Typography>
                            {/* Tipo de plato */}
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
                                            backgroundColor: '#009689',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#007b70',
                                            }
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value="Entrada">Entrada</ToggleButton>
                                <ToggleButton value="Plato_Principal">Plato Principal</ToggleButton>
                                <ToggleButton value="Postre">Postre</ToggleButton>
                            </ToggleButtonGroup>
                            
                            <div>
                                <Typography variant="subtitle2" sx={{ color: '#1e2939', mb:'0.5rem' }}>
                                    Especificaciones
                                </Typography>
                                <div className="flex flex-col gap-2 sm:flex-row sm:justify-around sm:gap-0.5">
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
                            <Typography variant="subtitle1" sx={{ color: '#1e2939', mb:'0.5rem' }}>
                                Características de la {productType.toLowerCase()} 
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
        </>
    )
}