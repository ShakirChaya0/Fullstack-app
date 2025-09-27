import "tailwindcss"
import { Chip } from "@mui/material";
import type { ProductCardsProps } from "../interfaces/product&PriceInterfaces";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import IcecreamIcon from '@mui/icons-material/Icecream';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import NoDrinksIcon from '@mui/icons-material/NoDrinks';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GlutenFreeImg from '../utils/GlutenFree.png';
import VegetarianImg from '../utils/Vegetarian.png'
import VeganImg from '../utils/Vegan.png'
import { useNavigate } from "react-router";


export function ProductCards({ filteredProducts, handleOpenModifyModal }: ProductCardsProps) {
    const navigate = useNavigate()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-5">
            {filteredProducts.map((product) => (
                <div className="flex flex-col justify-between min-w-auto min-h-auto bg-white border border-gray-200 px-4 py-4 rounded-xl
                    shadow-[0_2px_8px_0px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_0px_rgba(0,0,0,0.12)] transition-all duration-300
                "
                >
                    {/* Header de las tarjetas */}
                    <div className="flex flex-row justify-between items-start gap-2 mb-2">
                        <h4 className="text-black-300 font-bold text-2xl flex-1 min-w-0 leading-tight break-words">
                            {product.nombre}
                        </h4>
                        <div className="flex-shrink-0">
                            {product.estado == "Disponible" ? 
                                (<Chip 
                                    icon={<DoneIcon fontSize="small"/>} 
                                    label="Disponible" 
                                    sx={{ 
                                        backgroundColor: '#009689',
                                        color: 'white',
                                        '& .MuiChip-icon': {
                                            color: 'white'
                                        }
                                    }}
                                />) :
                                (<Chip 
                                    icon={<CloseIcon fontSize="small"/>} 
                                    label="No Disponible" 
                                    sx={{ 
                                        backgroundColor: '#fb2c36', 
                                        color: 'white',
                                         
                                        '& .MuiChip-icon': {
                                            color: 'white'
                                        }
                                    }}
                                />)
                            }
                        </div>
                    </div>
                    <p className="text-gray-800">
                        {product.descripcion}
                    </p>
                    {/* Contenido de las tarjetas */}
                    <div className="flex flex-row justify-between items-start mt-4">
                        <div className="flex flex-col justify-between h-24 mt-1">
                            <h3 className="text-teal-600 font-bold text-3xl">
                                ${product.precio.toLocaleString()}
                            </h3>
                            {/* Evaluando si es un comida o una bebida */}
                            {
                                product.tipo !== undefined &&
                                (
                                    (product.tipo === "Entrada" || product.tipo === "Plato_Principal") ? 
                                    (
                                        <p>
                                            <span className="text-gray-800"><RestaurantIcon fontSize="small"/></span> {product.tipo.replace("_"," ")}
                                        </p>
                                    ):
                                    (
                                        <p>
                                            <span className="text-gray-800"><IcecreamIcon fontSize="small"/></span> {product.tipo}
                                        </p>
                                    )
                                )

                            }
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            {/* Evaluando caracteristicas del producto */}
                            {
                                product.tipo !== undefined ?
                                (   
                                    <>
                                        <div className="flex">
                                            {product.esSinGluten && (
                                                <Chip 
                                                    icon={
                                                        <img
                                                            src={GlutenFreeImg}
                                                            alt="Gluten Free"
                                                            className="w-6 h-6 object-contain"
                                                            loading="lazy"
                                                        />
                                                    } 
                                                    label="Sin Gluten" 
                                                    sx={{ 
                                                        backgroundColor: '#ffd230',
                                                        color: '#364153',
                                                        fontWeight: '600',
                                                        '& .MuiChip-icon': {
                                                            color: '#364153'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex">    
                                            {product.esVegetariana && (
                                                <Chip 
                                                    icon={
                                                        <img
                                                            src={VegetarianImg}
                                                            alt="Vegetariana"
                                                            className="w-7 h-7 object-contain"
                                                            loading="lazy"
                                                        />
                                                    } 
                                                    label="Vegetariana" 
                                                    sx={{ 
                                                        backgroundColor: '#ffd230',
                                                        color: '#364153',
                                                        fontWeight: '600',
                                                        '& .MuiChip-icon': {
                                                            color: '#364153'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex">  
                                            {product.esVegana && (
                                                <Chip 
                                                    icon={
                                                        <img
                                                            src={VeganImg}
                                                            alt="Vegana"
                                                            className="w-6 h-6 object-contain"
                                                            loading="lazy"
                                                        />
                                                    } 
                                                    label="Vegana" 
                                                    sx={{ 
                                                        backgroundColor: '#ffd230',
                                                        color: '#364153',
                                                        fontWeight: '600',
                                                        '& .MuiChip-icon': {
                                                            color: '#364153'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </>
                                ):
                                (
                                    product.esAlcoholica ? 
                                    (
                                        <Chip 
                                            className="bg-gray"
                                            icon={<SportsBarIcon fontSize="small"/>} 
                                            label="Alcohólica" 
                                            sx={{ 
                                                backgroundColor: '#ffd230',
                                                color: '#364153',
                                                fontWeight: '600',
                                                '& .MuiChip-icon': {
                                                    color: '#364153'
                                                }
                                            }}
                                        />
                                    ):
                                    (
                                        <Chip 
                                            icon={<NoDrinksIcon fontSize="small"/>} 
                                            label="Sin Alcohol" 
                                            sx={{ 
                                                backgroundColor: '#ffd230',
                                                color: '#364153',
                                                fontWeight: '600',
                                                '& .MuiChip-icon': {
                                                    color: '#364153'
                                                }
                                            }}
                                        />
                                    )
                                    
                                )

                            }
                        </div>
                    </div>
                    {/* Footer de las tarjetas */}
                    <div className="flex flex-row justify-between mt-3 gap-2">
                        <button 
                            className="flex justify-center items-center gap-1 bg-gray-50 border-2 hover:bg-[#ffd230] 
                            rounded-lg font-medium transition-colors duration-200 h-[40px] flex-1 px-1 
                            whitespace-nowrap text-xs md:text-sm min-w-0 overflow-hidden hover:cursor-pointer"
                            onClick={ () => handleOpenModifyModal(product) }
                        >
                            <span className="flex-shrink-0"><ModeEditIcon fontSize="small"/></span>
                            <span className="hidden lg:inline truncate">Modificar Producto</span>
                            <span className="hidden md:inline lg:hidden truncate">Modificar</span>
                        </button>
                        <button
                            onClick={() => navigate(`/Admin/Productos/Precio/${product.idProducto}`)}
                            className="flex justify-center items-center gap-1 bg-gray-50 border-2 hover:bg-[#ffd230] 
                            rounded-lg font-medium transition-colors duration-200 h-[40px] flex-1 px-1 
                            whitespace-nowrap text-xs md:text-sm min-w-0 overflow-hidden hover:cursor-pointer"
                        >
                            <span className="flex-shrink-0"><AttachMoneyIcon fontSize="small"/></span>
                            <span className="hidden lg:inline truncate">Lista Precio</span>
                            <span className="hidden md:inline lg:hidden truncate">Precio</span>
                        </button>
                    </div>

                </div>
            ))}
        </div>
    )
}