import "tailwindcss"
import { LoadingProductPrice } from "../components/LoadingProductPrice";
import { Alert } from "@mui/material";
import { useProductsWithFilters } from "../hooks/useProducts";
import type { ProductPrice } from "../interfaces/product&PriceInterfaces";
import { lazy, Suspense, useState } from 'react';
import { NewProductModal } from "../components/NewProductModal";
import { ModifyProductModal } from "../components/ModifyProductModal";
import { SearchProducts } from "../components/SearchProducts";
import { FilterProducts } from "../components/FiltersProducts";
import { SkelentonProductCards } from "./SkeletonProductCards";

const LazyProductCards = lazy(() => import('../components/ProductCards').then(module => ({
    default: module.ProductCards
})));

const LazyPaginationControls = lazy(() => import('../components/PaginationControls').then(module => ({
    default: module.PaginationControls
})));

export function MainPanelProduct () {
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

    const handleOpenModifyModal = (product: ProductPrice) => {
        // Implementación de modal
        // Opción 2: Usando estado local (Opción 1 en SearchProducts.tsx) 
        setModifyModal({ state: true, product });
    }

    if (isLoading) return <LoadingProductPrice/>

    if (error && error.name !== "NotFoundError") {
      return (
        <div className="mx-auto w-[80%] mt-5">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-gray-600 font-bold text-2xl">
                    Gestión de Productos
                </h4>
                {/* Agregar button volver en caso de ser necesario */}
            </div>
            <Alert severity="error">
                Error al cargar productos
            </Alert>
        </div>
      );
    }

    return(
        <>  
            <div className="flex flex-col w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-4 mb-4 font-sans text-gray-600">
                <div>
                    <h2 className="font-bold text-3xl">
                        Gestión de Productos
                    </h2>
                    <p>
                        Administra el menú de tu resturante de forma simple y eficiente
                    </p>
                </div>

                <SearchProducts filtersToSearch={filters.search} updateFilter={updateFilter}></SearchProducts>
                
                <FilterProducts 
                    filterState={filters.state} 
                    filterType={filters.type}
                    filtersFoodType={filters.foodType}
                    filtersFoodSpec={filters.foodSpecification}
                    filtersDrinkSpec={filters.drinkSpecification}
                    updateFilter={updateFilter} 
                    clearFilters={clearFilters}
                ></FilterProducts>

                {allProducts.length === 0 ? 
                    (
                        <Alert severity="info">
                            No hay productos registrados con esas características.
                        </Alert>
                    ) :
                    (
                        <>
                            {filteredProducts.length == 0 && (
                                <Alert severity="info">
                                    No hay productos con esas características en esta página.
                                </Alert>
                            )}

                            <Suspense fallback={<SkelentonProductCards filteredProducts={filteredProducts}></SkelentonProductCards>}>
                                <LazyProductCards filteredProducts={filteredProducts} handleOpenModifyModal={handleOpenModifyModal}></LazyProductCards>
                
                                {pagination && (
                                    <LazyPaginationControls
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
                            </Suspense>
                        </>
                    )
                }

            </div>

            {/* El componente escucha el evento personalizado */}
            <NewProductModal></NewProductModal>
            {/* Se maneja su estado desde este página */}
            {modifyModal.state && modifyModal.product && (
                <ModifyProductModal 
                    isOpen={modifyModal.state}
                    product={modifyModal.product}
                    onClose={() => setModifyModal({state: false, product: null})}
                />
            )}
        
        </>
    )
}