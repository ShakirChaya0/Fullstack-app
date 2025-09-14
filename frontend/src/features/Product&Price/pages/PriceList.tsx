import { useParams } from "react-router"
import { usePrice } from "../hooks/usePrice"
import { Alert, Box, Typography } from "@mui/material"
import { LoadingPriceList } from "../components/LoadingPriceList"
import { TablePrice } from "../components/TablePrice"

export function PriceList() {
    const { idProducto } = useParams()

    const { priceList, isLoading: queryLoading, error: queryError } = usePrice(idProducto)

    if (queryLoading) return <LoadingPriceList/>
    

    if (queryError && queryError.name !== "NotFoundError") {
        return (
        <Box sx={{ width: "80%", mx: "auto", mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
                    Gestión de Horarios
                </Typography>
                {/* Agregar button volver en caso de ser necesario */}
            </Box>
            <Alert severity="error">
                Error al cargar horarios
            </Alert>
        </Box>
        );
    }


    return (
        <Box sx={{ 
            width: { xs: "95%", sm: "90%", md: "80%" }, 
            mx: "auto", 
            mt: 4,
            mb: 4
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: "#561d03", fontWeight: 'bold' }}>
                    Lista de precios 
                </Typography>
            </Box>
            {
                priceList.length === 0 ? 
                (
                    <Alert severity="info">
                        No existen precios registrados para este producto.
                    </Alert>
                ) :
                (
                    <>
                        <Typography variant="h5" sx={{ color: "#561d03", fontWeight: 'bold' }}>
                            Producto: {priceList[0].producto.idProducto} - {priceList[0].producto.nombre}
                        </Typography>
                    
                        {/* Tabla de precios */}
                        <TablePrice priceList={priceList}></TablePrice>
                    
                    </>
                )
            }
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop="1rem"
                marginX="1rem"
                gap={2}
            >

                {/* Botones */}
            </Box>
        </Box>
    )
}

/*
[
  {
    "_product": {
      "_productId": 3,
      "_name": "Coca-cola",
      "_description": "Bebida de cola",
      "_state": "No_Disponible",
      "_price": 5000,
      "_isAlcoholic": false
    },
    "_dateFrom": "2025-09-10T09:09:19.000Z",
    "_amount": 5000
  },
  {
    "_product": {
      "_productId": 3,
      "_name": "Coca-cola",
      "_description": "Bebida de cola",
      "_state": "No_Disponible",
      "_price": 6000.5,
      "_isAlcoholic": false
    },
    "_dateFrom": "2025-09-10T09:11:14.000Z",
    "_amount": 6000.5
  }
]
*/