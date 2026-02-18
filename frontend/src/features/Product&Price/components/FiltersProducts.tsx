import "tailwindcss"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import type { FiltersProductsProps } from "../interfaces/product&PriceInterfaces";

export function FilterProducts({filterType, filterState, filtersFoodType, filtersFoodSpec, filtersDrinkSpec, updateFilter, clearFilters}: FiltersProductsProps) {

    return (
        <div className="flex flex-col py-4 border-b border-gray-200 gap-4 mb-2">
            <div className="flex justify-between ">
                <div className="flex items-center gap-2">
                    <FilterAltIcon/>
                    <span className="text-gray-700 font-medium">Filtros:</span>
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 
                        rounded-lg transition-colors duration-200 h-[40px] min-w-[100px] justify-center hover:cursor-pointer mt-5"
                    >
                        <AutorenewIcon fontSize="small"/>
                        Limpiar Filtros
                    </button>
                </div>

            </div>

            <div className="flex flex-col justify-around sm:flex-row gap-2">
                <div className={`flex flex-col ${
                    filterType === 'Todos' && 'w-auto sm:w-[45%]'
                }`}>
                    <label className="text-sm font-medium text-gray-600">Categoría</label>
                    <div className="relative">
                        <select 
                            value={ filterType } 
                            onChange={(e) => updateFilter("type", e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-[40px] w-full sm:min-w-[140px]
                                    hover:border-gray-400 transition-colors duration-200 hover:cursor-pointer"
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

                {filterType === 'Comida' && (
                    <>
                        <div className="flex flex-col w-full sm:w-auto">
                            <label className="text-sm font-medium text-gray-600">Tipo Comida</label>
                            <div className="relative">
                                <select 
                                    value={ filtersFoodType } 
                                    onChange={(e) => updateFilter("foodType", e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-[40px] w-full sm:min-w-[140px]
                                    hover:border-gray-400 transition-colors duration-200 hover:cursor-pointer"
                                >
                                    <option value="Todos">Todos los tipos</option>
                                    <option value="Entrada">Entrada</option>
                                    <option value="Plato principal">Plato principal</option>
                                    <option value="Postre">Postre</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <KeyboardArrowDownIcon fontSize="small"/>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full sm:w-auto">
                            <label className="text-sm font-medium text-gray-600">Especificaciones</label>
                            <div className="relative">
                                <select 
                                    value={ filtersFoodSpec } 
                                    onChange={(e) => updateFilter("foodSpecification", e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-[40px] w-full sm:min-w-[140px]
                                    hover:border-gray-400 transition-colors duration-200 hover:cursor-pointer"
                                >
                                    <option value="Todos">Todos los tipos</option>
                                    <option value="Sin Gluten">Sin Gluten</option>
                                    <option value="Vegatariana">Vegatariana</option>
                                    <option value="Vegana">Vegana</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <KeyboardArrowDownIcon fontSize="small"/>
                                </div>
                            </div>
                        </div>
                    
                    </>
                )}

                {filterType === 'Bebida' && (
                    <div className="flex flex-col w-full sm:w-auto">
                        <label className="text-sm font-medium text-gray-600">Especificaciones</label>
                        <div className="relative">
                            <select 
                                value={ filtersDrinkSpec } 
                                onChange={(e) => updateFilter("drinkSpecification", e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm 
                                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-[40px] w-full sm:min-w-[140px]
                                hover:border-gray-400 transition-colors duration-200 hover:cursor-pointer"
                            >
                                <option value="Todos">Todos los tipos</option>
                                <option value="Sin alcohol">Sin alcohol</option>
                                <option value="Alcoholica">Alcóholica</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <KeyboardArrowDownIcon fontSize="small"/>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`flex flex-col ${
                        filterType === 'Todos' && 'w-auto sm:w-[45%]'
                    }`}>
                    <label className="text-sm font-medium text-gray-600">Disponibilidad</label>
                    <div className="relative">
                        <select 
                            value={ filterState } 
                            onChange={(e) => updateFilter("state", e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-[40px] w-full sm:min-w-[140px]
                                    hover:border-gray-400 transition-colors duration-200 hover:cursor-pointer"
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
            </div>
            


        </div>
    )
}