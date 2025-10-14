import React, { useEffect, useState, type FormEvent } from 'react';
import { Autocomplete, TextField, Button, List, ListItem, ListItemText, IconButton, Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useProducts } from '../../Products/hooks/useProducts';
import type { Bebida, Comida, TipoComida } from '../../Products/interfaces/products';
import { useParams } from 'react-router';
import type { OrderStatus } from '../../Order/interfaces/Order';
import { toast } from 'react-toastify';
import type { OrderLineStatus } from '../../KitchenOrders/types/SharedTypes';
import { useWebSocket } from '../../../shared/hooks/useWebSocket';

type LineaPedido = {
  nombreProducto: string;
  cantidad: number;
  estado: OrderLineStatus;
  nroLinea: number;
  tipo?: TipoComida  
};

type PedidoBackend = {
  idPedido: number;
  idMozo: string;
  nroMesa: number;
  cantidadCubiertos: number;
  horaInicio: string;
  estado: OrderStatus;
  observaciones: string;
  lineasPedido: LineaPedido[];
};

export default function ModifyOrder() {
    const { data: products, isError, isLoading } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState<Comida | Bebida | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const nroMesa = useParams()
    const [existingOrder, setExistingOrder] = useState<PedidoBackend | null>(JSON.parse(localStorage.getItem("modifyOrder") ?? ""))
    const { sendEvent, onEvent, offEvent } = useWebSocket()
    console.log("existingOrder: ", existingOrder)

    useEffect(() => {
        onEvent("modifiedOrderLine", (data) => {
            console.log("salio bien: ", localStorage.setItem("modifyOrder", JSON.stringify(data)))
            setExistingOrder(data)
            toast.success("Se modifico con exito su Pedido")
        })
        onEvent("deletedOrderLine", (data) => {
            console.log("hola: ", localStorage.setItem("modifyOrder", JSON.stringify(data)))
            setExistingOrder(data)
            toast.success("Se elimino con exito la linea de pedido")
        })
        onEvent("addedOrderLine", (data) => {
            console.log("hola: ", localStorage.setItem("modifyOrder", JSON.stringify(data)))
            setExistingOrder(data)
            toast.success("Se agrego con exito la nueva linea de pedido")
        })
        return () => {
            offEvent("modifiedOrderLine", (data) => {
                console.log("salio bien: ", localStorage.setItem("modifyOrder", JSON.stringify(data)))
            })
            offEvent("deletedOrderLine", (data) => {
                console.log("hola: ", localStorage.setItem("modifyOrder", JSON.stringify(data)))
            })
            offEvent("addedOrderLine", (data) => {
                console.log("hola: ", localStorage.setItem("modifyOrder", JSON.stringify(data)))
            })
        }

    }, [isError, isLoading, products])

    const handleAddProduct = (): void => {
        if (selectedProduct && quantity > 0) {
            const existingItemIndex = existingOrder?.lineasPedido.findIndex((lp) => (lp.nombreProducto === selectedProduct._name) && lp.estado === "Pendiente") ?? 0
            let orderLines;
            const product = products?.find((p) => p._name === selectedProduct._name)
            if (existingItemIndex > -1) {
                const cantidad = existingOrder?.lineasPedido[existingItemIndex].cantidad ? existingOrder.lineasPedido[existingItemIndex].cantidad += 1 : 1
                orderLines = [
                    {
                        nombre: selectedProduct._name, 
                        monto: selectedProduct._price, 
                        cantidad: cantidad,
                        tipo: (product && "_type" in product) ? product._type : undefined
                    }
                ]
            } else {
                orderLines = [
                    {
                        nombre: selectedProduct._name, 
                        monto: selectedProduct._price, 
                        cantidad: quantity,
                        tipo: (product && "_type" in product) ? product._type : undefined 
                    }
                ]
            }

            const isPrep = existingOrder?.lineasPedido.some((lp) => (lp.nombreProducto === selectedProduct._name) && (lp.estado === "Pendiente"))
            const linea = existingOrder?.lineasPedido.find((lp) => (lp.nombreProducto === selectedProduct._name) && (lp.estado === "Pendiente"))
            console.log("hola:, ",isPrep)
            if (!isPrep) {
                sendEvent("addOrderLine", {orderId: existingOrder?.idPedido, orderLines: orderLines})
            }
            else {
                const order = {
                    orderId: existingOrder?.idPedido,
                    lineNumbers: [linea?.nroLinea],
                    data: {
                        cantidadCubiertos: existingOrder?.cantidadCubiertos,
                        observacion: existingOrder?.observaciones,
                        items: orderLines
                    }
                }
                sendEvent("modifyOrder", order)
            }
            setSelectedProduct(null);
            setQuantity(1);
        }
    };

    const handleRemoveItem = (indexToRemove: number, nameProduct: string, lineNumber: number | undefined): void => {
        const correspondingLine = existingOrder?.lineasPedido.filter(
            (lp) => (lp.nombreProducto === nameProduct) && (lp.nroLinea === lineNumber)).find((lp) => lp.estado === "Pendiente");

    
        console.log("corres: ", correspondingLine)
        if (!correspondingLine || correspondingLine.estado !== "Pendiente") {
            toast.warning("No se puede eliminar esta línea porque ya está en preparación o fue entregada");
            return;
        }

        sendEvent("deleteOrderLine", { orderId: existingOrder?.idPedido, lineNumber });
    };

    const calculateTotal = (): string => {
        return existingOrder?.lineasPedido.reduce((total, item) => {
            const price = products?.find((p) => p._name === item.nombreProducto)?._price ?? 1
            return total + price * item.cantidad
        }, 0).toFixed(2) ?? "";
    };

    const handleSubmitOrder = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const data = Object.fromEntries(form.entries())
        if (+data.comensales < 0) {
            toast.warning("Los comensales no estan en un formato correcto")
            return
        }

        if (+data.cantidad < 0) {
            toast.warning("La  no estan en un formato correcto")
            return
        }

        if (existingOrder?.lineasPedido.length === 0) {
            toast.warning("Los comensales no estan en un formato correcto")
            return;
        }

        const lineasDePedido = existingOrder?.lineasPedido.map((lp) => {
            const precio = products?.find((p) => p._name === lp.nombreProducto)?._price ?? 1
            return {producto: lp, cantidad: lp.cantidad, estado: "En_Preparacion", subtotal: lp.cantidad * precio}
        })

        const orderData = {
            comensales: +data.comensales,
            observaciones: data.observacion as string,
            lineasDePedido: lineasDePedido,
            nrolineasDePedido: existingOrder?.lineasPedido.map((lp) => lp.nroLinea),
        };

        const order = {
            orderId: existingOrder?.idPedido,
            lineNumbers: orderData.nrolineasDePedido,
            data: {
                cantidadCubiertos: orderData.comensales,
                observacion: orderData.observaciones === existingOrder?.observaciones ? undefined : orderData.observaciones,
                items: lineasDePedido
            }
        }
        console.log(order)
        sendEvent("modifyOrder", order)
    };


    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f9fafb', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    {`Modificar Pedido Mesa: ${nroMesa.nroMesa}`}
                </Typography>
            </Box>
            <form onSubmit={handleSubmitOrder}>
                <Grid container spacing={4}>
                    <Grid>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom fontWeight="medium">Añadir Producto</Typography>
                                <Autocomplete
                                    fullWidth
                                    options={products || []}
                                    getOptionLabel={(option) => option._name}
                                    value={selectedProduct}
                                    onChange={(event: React.SyntheticEvent, newValue: Comida | Bebida | null) => {
                                        setSelectedProduct(newValue);
                                    }}
                                    isOptionEqualToValue={(option, value) => option._productId === value._productId}
                                    renderInput={(params) => <TextField {...params} label="Buscar producto" margin="normal" />}                                    
                                />
                                <TextField
                                    fullWidth
                                    label="Cantidad"
                                    type="number"
                                    name='cantidad'
                                    value={quantity}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                    margin="normal"
                                    InputProps={{ inputProps: { min: 1 } }}
                                    required
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={handleAddProduct}
                                    disabled={(!selectedProduct)}
                                    fullWidth
                                    sx={{ mt: 2, py: 1.2, fontWeight: 'bold' }}
                                >
                                    Agregar al Pedido
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom fontWeight="medium">Resumen del Pedido</Typography>
                                 <List sx={{ minHeight: '150px' }}>
                                    {existingOrder?.lineasPedido.length === 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '150px', color: 'text.secondary' }}>
                                            <Typography>El pedido está vacío</Typography>
                                        </Box>
                                    )}
                                    {existingOrder?.lineasPedido.map((item, index) => {
                                        const isPending = existingOrder?.lineasPedido.find(() => item.estado === "Pendiente")
                                        const price = products?.find((p) => p._name === item.nombreProducto)?._price ?? 1
                                        return (
                                            <React.Fragment key={item.nroLinea}>
                                             <ListItem
                                                 secondaryAction={
                                                     <IconButton 
                                                     edge="end" 
                                                     aria-label="delete" 
                                                     onClick={() => handleRemoveItem(index, item.nombreProducto, item.nroLinea)}
                                                     disabled={!isPending}
                                                     >
                                                         <DeleteIcon color={isPending ? "error" : "disabled"}  />
                                                     </IconButton>
                                                 }
                                             >
                                                 <ListItemText
                                                     primary={<Typography fontWeight="medium">{`${item.nombreProducto} (x${item.cantidad})`}</Typography>}
                                                     secondary={`$${(price * item.cantidad).toFixed(2)}`}
                                                 />
                                             </ListItem>
                                              {index < existingOrder.lineasPedido.length - 1 && <Divider component="li" />}
                                             </React.Fragment>
                                        )
                                    })}
                                </List>
                                 <Divider sx={{ my: 2 }} />
                                <Typography variant="h5" align="right" sx={{ mt: 2, mr: 2 }} fontWeight="bold">
                                    Total: ${calculateTotal()}
                                </Typography>
                                <Box sx={{ mt: 3 }}>
                                     <TextField
                                        fullWidth
                                        label="Cantidad de Comensales"
                                        required
                                        type="number"
                                        margin="normal"
                                        name='comensales'
                                        defaultValue={existingOrder?.cantidadCubiertos}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Observaciones del Pedido"
                                        multiline
                                        rows={3}
                                        margin="normal"
                                        placeholder="Ej: sin sal, punto de cocción, etc."
                                        name='observacion'
                                        defaultValue={existingOrder?.observaciones}
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type='submit'
                                    disabled={(existingOrder?.lineasPedido.length === 0)}
                                    fullWidth
                                    sx={{ mt: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                                >
                                    Finalizar y Modificar Pedido
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
        </Box>  
    );
}
