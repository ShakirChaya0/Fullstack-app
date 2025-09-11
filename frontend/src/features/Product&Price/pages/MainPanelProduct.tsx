import "tailwindcss"
import { LoadingProductPrice } from "../components/LoadingProductPrice";
import { Alert, Autocomplete, Chip, TextField } from "@mui/material";
import { useProductsWithFilters } from "../hooks/useProducts";
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


export function MainPanelProduct () {
    const { 
        allProducts,
        filteredProducts,
        isLoading,
        error,
        filters,
        updateFilter,
        clearFilters 
    } = useProductsWithFilters()

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
            <div className="flex justify-between flex-col w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-4 mb-4">
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
                            onInputChange={(event, newInputValue) => {
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
                        className="flex items-center gap-2 bg-[#009689] hover:bg-[#00bba7] text-white px-4 py-2 
                        rounded-lg font-medium transition-colors duration-200 whitespace-nowrap h-[40px]"
                    >
                        <span className="text-lg font-bold mb-1"><AddCircleIcon fontSize="small"/></span>
                        Nuevo Producto
                    </button>
                </div>
                
                <div className="flex flex-col justify-around items-start sm:flex-row sm:items-center py-4 border-b border-gray-200 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredProducts.map((product) => (
                        <div className="flex flex-col min-w-auto min-h-auto border-1 border-gray-400 px-2 py-2 rounded-2x1
                         hover:border-red-500 hover:shadow-[0_0_5px_2px_#99a1af]
                        "
                        >
                            <div className="flex flex-row justify-between">
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
                                            backgroundColor: 'red', 
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
                            
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-col">
                                    <h3 className="text-teal-600 font-bold text-3xl">
                                        ${product.precio}
                                    </h3>
                                    {/* Evaluando si es un comida o una bebida */}
                                    {
                                        product.tipo !== undefined ?
                                        (
                                            (product.tipo == "Entrada" || product.tipo == "Plato_Principal") ? 
                                            (
                                                <p>
                                                    <span className="text-gray-800"><RestaurantIcon fontSize="small"/></span>{product.tipo}
                                                </p>
                                            ):
                                            (
                                                <p>
                                                    <span className="text-gray-800"><IcecreamIcon fontSize="small"/></span>{product.tipo}
                                                </p>
                                            )
                                        ):
                                        (
                                            <p></p> // No se imprime nada
                                        )

                                    }
                                </div>
                                <div className="flex flex-row">
                                    {/* Evaluando caracteristicas del producto */}
                                    {
                                        product.tipo !== undefined ?
                                        (
                                            (product.tipo == "Entrada" || product.tipo == "Plato_Principal") ? 
                                            (
                                                <p>
                                                    <span className="text-gray-800"><RestaurantIcon fontSize="small"/></span>{product.tipo}
                                                </p>
                                            ):
                                            (
                                                <p>
                                                    <span className="text-gray-800"><IcecreamIcon fontSize="small"/></span>{product.tipo}
                                                </p>
                                            )
                                        ):
                                        (
                                            product.esAlcoholica ? 
                                            (
                                                <Chip 
                                                    icon={<SportsBarIcon fontSize="small"/>} 
                                                    label="Alcohólica" 
                                                    sx={{ 
                                                        backgroundColor: '#ffd230',
                                                        color: 'black',
                                                        fontWeight: '600',
                                                        '& .MuiChip-icon': {
                                                            color: 'black'
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
                                                        color: 'black',
                                                        fontWeight: '600',
                                                        '& .MuiChip-icon': {
                                                            color: 'black'
                                                        }
                                                    }}
                                                />
                                            )
                                            
                                        )

                                    }
                                </div>
                                    
                                
                            </div>

                        </div>
                    ))}
                </div>

                {/* Debugger */}
                <div className="bg-gray-300 p-4 rounded-lg flex flex-col w-auto">
                    <h3 className="font-bold text-lg mb-3">🐛 Debug useProductsWithFilters</h3>
                    
                    {/* Estado del useQuery */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-md mb-2">📡 Query State:</h4>
                        <div className="bg-white p-3 rounded border">
                            <p><span className="font-semibold">isLoading:</span> {isLoading ? '✅ true' : '❌ false'}</p>
                            <p><span className="font-semibold">error:</span> {error ? `🔴 ${error.message}` : '✅ null'}</p>
                            <p><span className="font-semibold">allProducts length:</span> {allProducts?.length || 0}</p>
                        </div>
                    </div>

                    {/* Estado de los filtros */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-md mb-2">🎛️ Filters State:</h4>
                        <div className="bg-white p-3 rounded border">
                            <p><span className="font-semibold">search:</span> "{filters.search}"</p>
                            <p><span className="font-semibold">type:</span> {filters.type}</p>
                            <p><span className="font-semibold">state:</span> {filters.state}</p>
                        </div>
                    </div>

                    {/* Datos raw (primeros 2 productos) */}
                    {allProducts && allProducts.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-md mb-2">📋 Sample Data (first 2):</h4>
                            <div className="bg-white p-3 rounded border">
                                <pre className="text-xs overflow-x-auto">
                                    {JSON.stringify(allProducts.slice(0, 2), null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        
        </>
    )
}