import { Select, MenuItem, FormControl } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import type { PaginationControlsProps } from '../interfaces/product&PriceInterfaces';

export function PaginationControls({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
    onPreviousPage,
    onNextPage,
    onGoToPage,
    onChangeLimit
}: PaginationControlsProps) {

    const handleLimitChange = (newLimit: number) => {
        onChangeLimit(newLimit);
    };

    const getVisiblePages = () => {
        const aux = 2; // Páginas a mostrar a cada lado de la actual
        const pages: (number | string)[] = []
        
        // Primera página
        if (currentPage > aux + 1) {
            pages.push(1)
            if (currentPage > aux + 2) {
                pages.push('...')
            }
        }
        
        // Páginas alrededor de la actual
        for (let i = Math.max(1, currentPage - aux); 
             i <= Math.min(totalPages, currentPage + aux); 
             i++) {
            pages.push(i)
        }
        
        // Última página
        if (currentPage < totalPages - aux) {
            if (currentPage < totalPages - aux - 1) {
                pages.push('...')
            }
            pages.push(totalPages)
        }
        
        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            {/* Información de elementos */}
            <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                    Mostrando de <span className="font-semibold text-cyan-600">{startItem}</span> a{' '}
                    <span className="font-semibold text-cyan-600">{endItem}</span> de{' '}
                    <span className="font-semibold text-cyan-600">{totalItems}</span> productos
                </span>
                <span>
                    Página <span className="font-semibold text-cyan-600">{currentPage}</span> de{' '}
                    <span className="font-semibold text-cyan-600">{totalPages}</span>
                </span>
            </div>

            {/* Controles de navegación */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                {/* Navegación por páginas */}
                <div className="flex flex-1 items-center gap-2">
                    <button
                        onClick={() => onGoToPage(1)}
                        disabled={currentPage === 1}
                        className={`
                            p-2 rounded-lg border transition-all duration-200
                            ${currentPage === 1 
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                            }
                        `}
                    >
                        <FirstPageIcon fontSize="small" />
                    </button>
                    <div className="hidden sm:flex">
                        <button
                            onClick={onPreviousPage}
                            disabled={!hasPreviousPage}
                            className={`
                                flex items-center gap-1 px-3 py-2 rounded-lg border transition-all duration-200
                                ${!hasPreviousPage 
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                                }
                            `}
                        >
                            <ChevronLeftIcon fontSize="small" />
                            <span className="hidden sm:inline">Anterior</span>
                        </button>
                    </div>

                    {/* Números de página */}
                    <div className="flex items-center gap-1">
                        {getVisiblePages().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && onGoToPage(page)}
                                disabled={typeof page === 'string'}
                                className={`
                                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${typeof page === 'string'
                                        ? 'text-gray-400 cursor-default'
                                        : page === currentPage
                                        ? 'bg-cyan-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 border border-gray-300 hover:border-cyan-500'
                                    }
                                `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Botón página siguiente */}
                    <div className="hidden sm:flex">
                        <button
                            onClick={onNextPage}
                            disabled={!hasNextPage}
                            className={`
                                flex items-center gap-1 px-3 py-2 rounded-lg border transition-all duration-200
                                ${!hasNextPage 
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                                }
                            `}
                        >
                            <span className="hidden sm:inline">Siguiente</span>
                            <ChevronRightIcon fontSize="small" />
                        </button>
                    </div>

                    {/* Botón última página */}
                    <button
                        onClick={() => onGoToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`
                            p-2 rounded-lg border transition-all duration-200
                            ${currentPage === totalPages 
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                            }
                        `}
                    >
                        <LastPageIcon fontSize="small" />
                    </button>
                </div>

                {/* Selector de elementos por página */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">Mostrar:</span>
                    <FormControl size="small">
                        <Select
                            value={itemsPerPage}
                            onChange={(e) => handleLimitChange(Number(e.target.value))}
                            sx={{
                                minWidth: '70px',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0092b8',
                                }
                            }}
                        >
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={27}>27</MenuItem>
                        </Select>
                    </FormControl>
                    <span className="text-sm text-gray-600">por página</span>
                </div>
            </div>
        </div>
    );
}