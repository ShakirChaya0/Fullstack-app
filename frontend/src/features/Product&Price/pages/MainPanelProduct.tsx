import "tailwindcss"
import { LoadingProductPrice } from "../components/LoadingProductPrice";
import { Alert, Autocomplete, Chip, TextField } from "@mui/material";
import { useProductsWithFilters } from "../hooks/useProducts";
import type { ProductPrice } from "../interfaces/product&PriceInterfaces";
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutorenewIcon from '@mui/icons-material/Autorenew';
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
import { NewProductModal } from "../components/NewProductModal";
import { ModifyProductModal } from "../components/ModifyProductModal";
import { PaginationControls } from "../components/PaginationControls";
import { useNavigate } from "react-router";


export function MainPanelProduct () {
    const navigate = useNavigate()

    const { 
        allProducts,
        pagination,
        filteredProducts,
        isLoading,
        error,
        filters,
        updateFilter,
        clearFilters,
        nextPage,
        previousPage,
        goToPage,
        changeLimit
    } = useProductsWithFilters()

    const [modifyModal, setModifyModal] = useState<{state: boolean, product: ProductPrice | null}>({state: false, product: null})

    const handleOpenModal = () => {
        // Implementación de modal
        // Opción 1: Evento personalizado: Dispatch que abre la modal
        window.dispatchEvent(new CustomEvent('openNewProductModal'));
    }

    const handleOpenModifyModal = (product: ProductPrice) => {
        // Implementación de modal
        // Opción 2: Usando estado local 
        setModifyModal({ state: true, product });
    }

    if (isLoading) return <LoadingProductPrice/>

    if (error && error.name !== "NotFoundError") {
      return (
        <div className="mx-auto w-[80%] mt-5">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-[#561d03] font-bold text-2xl">
                    Gestión de Productos
                </h4>
                {/* Agregar button volver en caso de ser necesario */}
            </div>
            <Alert>
                Error al cargar productos
            </Alert>
        </div>
      );
    }

    return(
        <>
            <div className="flex justify-between flex-col w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-4 mb-4 font-sans text-gray-600">
                <div>
                    <h2 className="text-black-300 font-bold text-3xl">
                        Gestión de Productos
                    </h2>
                    <p className="text-black-300">
                        Administra el menú de tu resturante de forma simple y eficiente
                    </p>
                </div>

                <div className="flex flex-row justify-between gap-2 items-center my-3">
                    <div className="flex flex-row items-center w-[60%] sm:w-[60%] md:w-[70%] lg:w-[80%] rounded-lg bg-white transition-all duration-200 border border-gray-200
                    hover:border-cyan-500 hover:shadow-[0_0_5px_2px_rgba(14,116,144,0.5)]
                    focus-within:border-cyan-500 focus-within:shadow-[0_0_5px_2px_rgba(14,116,144,0.5)] h-[40px]">
                        <SearchIcon className="text-gray-400 mx-2 text-[20px]"/>
                        <Autocomplete
                            className="w-full"
                            id="searchTool"
                            freeSolo
                            value={ filters.search }
                            onInputChange={(_, newInputValue) => {
                                updateFilter("search", newInputValue);
                            }}
                            options={allProducts.map((option) => {return `${option.idProducto} - ${option.nombre}`})}
                            filterOptions={(options, params) => {
                                // Mostrar opciones si hay al menos 1 carácter
                                if (params.inputValue.length === 0) {
                                    return [];
                                }
                                return options.filter((option) =>
                                    option.toLowerCase().includes(params.inputValue.toLowerCase())
                                );
                            }}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    placeholder="Buscador"
                                    slotProps={
                                        {
                                            inputLabel: {shrink: false, style: { display: 'none' }},
                                            input: {
                                                ...params.InputProps,
                                                disableUnderline: true,
                                                sx: {
                                                    '& fieldset': { border: 'none' },
                                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                }
                                            }
                                        }
                                    }
                                />
                            )}
                        />
                    </div>
                    <button 
                        onClick={handleOpenModal}
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 
                        rounded-lg font-medium transition-colors duration-200 whitespace-nowrap h-[40px]"
                    >
                        <span className="text-lg font-bold mb-1"><AddCircleIcon fontSize="small"/></span>
                        Nuevo Producto
                    </button>
                </div>
                
                <div className="flex flex-col justify-around items-start sm:flex-row sm:items-center py-4 border-b border-gray-200 gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <FilterAltIcon/>
                        <span className="text-gray-700 font-medium">Filtros:</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-medium text-gray-600">Categoría</label>
                            <div className="relative">
                                <select 
                                    value={filters.type} 
                                    onChange={(e) => updateFilter("type", e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-[40px] w-full sm:min-w-[140px]
                                    hover:border-gray-400 transition-colors duration-200"
                                >
                                    <option value="Todos">Todos los tipos</option>
                                    <option value="Comida">Comida</option>
                                    <option value="Bebida">Bebida</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <KeyboardArrowDownIcon fontSize="small"/>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-medium text-gray-600">Disponibilidad</label>
                            <div className="relative">
                                <select 
                                    value={filters.state} 
                                    onChange={(e) => updateFilter("state", e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-[40px] w-full sm:min-w-[140px]
                                    hover:border-gray-400 transition-colors duration-200"
                                >
                                    <option value="Todos">Todos los estados</option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="No_Disponible">No Disponible</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <KeyboardArrowDownIcon fontSize="small"/>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-medium text-transparent">Acciones</label>
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 
                                rounded-lg transition-colors duration-200 h-[40px] min-w-[100px] justify-center"
                            >
                                <AutorenewIcon fontSize="small"/>
                                Limpiar Filtros
                            </button>
                        </div>
                </div>

                {filteredProducts.length === 0 && 
                    <Alert severity="error">
                        Ups! No se encontraron resultados para su busqueda
                    </Alert>
                }

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-5">
                    {filteredProducts.map((product) => (
                        <div className="flex flex-col justify-between min-w-auto min-h-auto bg-white border border-gray-200 px-4 py-4 rounded-xl
                         shadow-[0_2px_8px_0px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_0px_rgba(0,0,0,0.12)] transition-all duration-300
                        "
                        >
                            {/* Header de las tarjetas */}
                            <div className="flex flex-row justify-between mb-2">
                                <h4 className="text-black-300 font-bold text-2xl">
                                    {product.nombre}
                                </h4>
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
                            <p className="text-gray-800">
                                {product.descripcion}
                            </p>
                            {/* Contenido de las tarjetas */}
                            <div className="flex flex-row justify-between items-start mt-4">
                                <div className="flex flex-col justify-between h-24 mt-1">
                                    <h3 className="text-teal-600 font-bold text-3xl">
                                        ${product.precio}
                                    </h3>
                                    {/* Evaluando si es un comida o una bebida */}
                                    {
                                        product.tipo !== undefined ?
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
                                        ):
                                        (
                                            <p></p> // No se imprime nada
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
                                    whitespace-nowrap text-xs md:text-sm min-w-0 overflow-hidden"
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
                                    whitespace-nowrap text-xs md:text-sm min-w-0 overflow-hidden"
                                >
                                    <span className="flex-shrink-0"><AttachMoneyIcon fontSize="small"/></span>
                                    <span className="hidden lg:inline truncate">Lista Precio</span>
                                    <span className="hidden md:inline lg:hidden truncate">Precio</span>
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
                {pagination && (
                    <PaginationControls
                        currentPage={pagination.paginaActual}
                        totalPages={pagination.paginaTotales}
                        totalItems={pagination.itemsTotales}
                        itemsPerPage={pagination.itemsPorPagina}
                        hasNextPage={pagination.proxPagina}
                        hasPreviousPage={pagination.antePagina}
                        onPreviousPage={previousPage}
                        onNextPage={nextPage}
                        onGoToPage={goToPage}
                        onChangeLimit={changeLimit}
                    />
                )}
            </div>

            {/* El componente escucha el evento personalizado */}
            <NewProductModal existingProducts={ allProducts }></NewProductModal>
            {/* Se maneja su estado desde este página */}
            {modifyModal.state && modifyModal.product && (
                <ModifyProductModal 
                    isOpen={modifyModal.state}
                    product={modifyModal.product}
                    existingProducts={ allProducts }
                    onClose={() => setModifyModal({state: false, product: null})}
                    currentPage={pagination?.paginaActual}
                    limit={pagination?.itemsPorPagina}
                />
            )}
        
        </>
    )
}