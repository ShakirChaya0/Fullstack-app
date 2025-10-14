import "tailwindcss"
import { useParams } from "react-router"
import { usePrice } from "../hooks/usePrice"
import { Alert, Box, Typography } from "@mui/material"
import { LoadingPriceList } from "../components/LoadingPriceList"
import { BackButton } from "../../../shared/components/BackButton"
import { NewPriceModal } from "../components/NewPriceModal"
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal"
import { lazy, Suspense, useState } from "react"
import type { PriceList } from "../interfaces/product&PriceInterfaces"
import { SkeletonPriceList } from "./SkeletonPriceList"

const LazyTablePrice = lazy(() => import('../components/TablePrice').then(module => ({
    default: module.TablePrice
})));

export default function PriceList() {
    const { idProducto } = useParams()
    const [selectedPrice, setSelectedPrice] = useState<PriceList | null>(null)

    const { priceList, isLoading: queryLoading, error: queryError } = usePrice(idProducto)

    const handleOpenPriceRegistration = () => {
        // Implementación de modal para registrar precio
        window.dispatchEvent(new CustomEvent('openPriceRegistrationModal'));
    }

    const handleDeletePrice = (price: PriceList) => {
        setSelectedPrice(price);
    }

    if (queryLoading) return <LoadingPriceList/>
    
    if (queryError && queryError.name !== "NotFoundError") {
        return (
        <Box sx={{ width: "80%", mx: "auto", mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
                    Gestión de Precios
                </Typography>
                {/* Agregar button volver en caso de ser necesario */}
            </Box>
            <Alert severity="error">
                Error al cargar precio
            </Alert>
        </Box>
        );
    }

    return (
        <div className="flex flex-col w-[80%] mx-auto my-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-gray-600 font-bold text-3xl">
                    Gestión de Precios
                </h2>
            </div>
            {
                priceList.length === 0 ? 
                (
                    <Alert severity="info">
                        No existen precios registrados para el producto: { idProducto }.
                    </Alert>
                ) :
                (
                    <>
                        <p className="text-gray-800 mb-2">
                            Producto: {priceList[0].producto.idProducto} - {priceList[0].producto.nombre}
                        </p>
                        {/* Tabla de precios */}
                        <Suspense fallback={<SkeletonPriceList priceList={priceList}></SkeletonPriceList>}>
                            <LazyTablePrice 
                                priceList={priceList} 
                                onDeletePrice={handleDeletePrice}
                            />
                        </Suspense>
                    
                    </>
                )
            }
            <div className="flex justify-between items-center mt-5 mx-1 gap-2">
                {/* Botones */}
                <BackButton url="/Admin/Productos/"></BackButton>
                <button 
                    onClick={handleOpenPriceRegistration}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-[#0891b2] hover:text-white border-2 hover:border-black text-gray-600 px-4 py-2 
                    rounded-lg font-medium transition-colors duration-200 whitespace-nowrap h-[40px] hover:cursor-pointer"
                >
                    Nuevo Precio
                </button>
            </div>

            {/* Modal Nuevo precio */}
            { idProducto ? 
            (
                <>
                    <NewPriceModal idProducto={idProducto} preciosRegistrados={priceList}></NewPriceModal>
                    <DeleteConfirmationModal 
                        idProducto={idProducto}
                        selectedPrice={selectedPrice}
                        amountPrices={priceList.length}
                    />
                </>
            ):
            (
                <Alert severity="error">
                    No se pudo determinar el producto seleccionado
                </Alert>
            )}
        </div>
    )
}