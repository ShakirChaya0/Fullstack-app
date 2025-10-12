import React, { useEffect, useState, type FormEvent } from 'react';
import { Autocomplete, TextField, Button, List, ListItem, ListItemText, IconButton, Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useProducts } from '../../Products/hooks/useProducts';
import type { Bebida, Comida } from '../../Products/interfaces/products';
import { useLocation, useParams } from 'react-router';
import useSaveTableOrder from '../hooks/useSaveTableOrder';
import type { OrderStatus } from '../../Order/interfaces/Order';
import { toast } from 'react-toastify';
import { useWebSocket } from '../../../shared/hooks/useWebSocket';
import type { OrderLineStatus } from '../../KitchenOrders/types/SharedTypes';

type LineaPedido = {
    cantidad: number,
    estado: OrderLineStatus,
    nombreProducto: string,
    nroLinea: number
}

type Pedido = {
    idPedido: number,
    lineasPedido: LineaPedido[],
    estado: OrderStatus,
    observaciones: string,
    comensales: number
}


type OrderItemComida = Comida & { quantity: number };
type OrderItemBebida = Bebida & { quantity: number };
type BackendOrder = Pedido & {
    nroMesa: number,
    idMozo: string,
    cantidadCubiertos: number,
    horaInicio: string,
}

export default function CreateOrder() {
    const { data: products, isLoading } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState<Comida | Bebida | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [orderItems, setOrderItems] = useState<(OrderItemComida | OrderItemBebida)[]>([]);
    const [defaultValues, setDefaultValues] = useState< {comensales: number, observacion: string} | null>(null)
    const nroMesa = useParams()
    const location = useLocation();
    const action = (location.state?.action || localStorage.getItem("modifyOrder") ? "modificar" : null) || "agregar";
    const existingOrder: BackendOrder = (location.state?.existingOrder || localStorage.getItem("modifyOrder")) || null;
    const { mutate, isPending, isError, failureReason } = useSaveTableOrder()
    const { sendEvent, offEvent, onEvent } = useWebSocket()
    const showOrder = existingOrder ?? orderItems

    
    useEffect(() => {
        if (existingOrder) {
            const items: (OrderItemComida | OrderItemBebida)[] =
                existingOrder.lineasPedido.map((lp) => {
                    const product = products?.find(
                        (p) =>  p._name === lp.nombreProducto
                    );
                  return { ...product, quantity: lp.cantidad };
            }).filter((item): item is OrderItemComida | OrderItemBebida => item !== null);

            setOrderItems(items);
            setQuantity(1);

            setDefaultValues({
              comensales: existingOrder.cantidadCubiertos,
              observacion: existingOrder.observaciones,
            });
            localStorage.setItem("modifyOrder", JSON.stringify({items: items, comensales: existingOrder.cantidadCubiertos, observacion: existingOrder.observaciones}))
        }

        onEvent("modifiedOrderLine", (data) => console.log("hola: ", data))
        return () => {
            offEvent("modifiedOrderLine", (data) => console.log("hola: ",data))
        }
    }, [action, existingOrder]);

    const handleAddProduct = (): void => {
        if (selectedProduct && quantity > 0) {
            const existingItemIndex = orderItems.findIndex(item => item._productId === selectedProduct._productId);

            if (existingItemIndex > -1) {
                const updatedItems = [...orderItems];
                updatedItems[existingItemIndex].quantity += quantity;
                setOrderItems(updatedItems);
            } else {
                setOrderItems([...orderItems, { ...selectedProduct, quantity }]);
            }

            setSelectedProduct(null);
            setQuantity(1);
        }
    };

    const handleRemoveItem = (productId: number | undefined): void => {
        setOrderItems(orderItems.filter(item => item._productId !== productId));
    };

    const calculateTotal = (): string => {
        if (!products || !showOrder?.lineasPedido) return "0.00";

        const total = showOrder.lineasPedido.reduce((acc, item) => {
          const productData = products.find(p => p._name === item.nombreProducto);
          return acc + (productData?._price ?? 0) * item.cantidad;
        }, 0);

        return total.toFixed(2);
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

        if (orderItems.length === 0) {
            toast.warning("Los comensales no estan en un formato correcto")
            return;
        }

        const lineasDePedido = orderItems.map((p) => {
            return {producto: p, cantidad: p.quantity, estado: "Pendiente", subtotal: p.quantity * p._price}
        })

        const orderData = {
            comensales: +data.comensales,
            observaciones: data.observacion as string,
            lineasDePedido: lineasDePedido,
        };
        
        if(action === "agregar") {
            mutate({observaciones: orderData.observaciones, comensales: orderData.comensales, tableNumber: +nroMesa.nroMesa!, lineasPedido: orderData.lineasDePedido })
        }
        else {
            const lineNumbers = existingOrder.lineasPedido.map((lp) => lp.nroLinea)
            console.log({observaciones: orderData.observaciones, comensales: orderData.comensales, tableNumber: +nroMesa.nroMesa!, lineasPedido: orderData.lineasDePedido })
            sendEvent("modifyOrder", {orderId: existingOrder.idPedido, lineNumber: lineNumbers, data: {observaciones: orderData.observaciones, comensales: orderData.comensales, tableNumber: +nroMesa.nroMesa!, lineasPedido: orderData.lineasDePedido}})
        }

    };


    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f9fafb', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    { action === "agregar" ? `Crear Nuevo Pedido Mesa: ${nroMesa.nroMesa}` : `Modificar Pedido Mesa: ${nroMesa.nroMesa}`}
                </Typography>
            </Box>
            <form onSubmit={handleSubmitOrder}>
                { isError && <div className='w-full mb-2 px-6 py-2 bg-red-300 text-red-600 border rounded-lg border-red-600 '>{failureReason?.message}</div>}
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
                                    disabled={isPending}
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
                                    disabled={isPending}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={handleAddProduct}
                                    disabled={(!selectedProduct || isPending)}
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
                                    {isLoading ? (
                                        <Typography>Cargando productos...</Typography>
                                        ) : orderItems.length === 0 ? (
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              height: '100%',
                                              minHeight: '150px',
                                              color: 'text.secondary',
                                            }}
                                          >
                                            <Typography>El pedido está vacío</Typography>
                                          </Box>
                                        ) : (
                                          showOrder.lineasPedido.map((item, index) => {
                                            const productsData = products?.find((p) => p._name === item.nombreProducto)
                                            console.log(productsData)
                                            return (
                                                <React.Fragment key={productsData?._productId}>
                                                  <ListItem
                                                    secondaryAction={
                                                      <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => handleRemoveItem(productsData?._productId)}
                                                      >
                                                        <DeleteIcon color="error" />
                                                      </IconButton>
                                                    }
                                                  >
                                                    <ListItemText
                                                      primary={
                                                        <Typography fontWeight="medium">
                                                          {`${productsData?._name ?? 'Producto desconocido'} (x${item.cantidad})`}
                                                        </Typography>
                                                      }
                                                      secondary={`$${((productsData?._price ?? 0) * item.cantidad).toFixed(2)}`}
                                                    />
                                                  </ListItem>
                                                  {index < orderItems.length - 1 && <Divider component="li" />}
                                                </React.Fragment>
                                            )
                                            })
                                        )
                                    }
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
                                        defaultValue={defaultValues?.comensales}
                                        disabled={isPending}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Observaciones del Pedido"
                                        multiline
                                        rows={3}
                                        margin="normal"
                                        placeholder="Ej: sin sal, punto de cocción, etc."
                                        name='observacion'
                                        defaultValue={defaultValues?.observacion}
                                        disabled={isPending}
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    color={`${isPending ? "inherit" : "success"}`}
                                    type='submit'
                                    disabled={(orderItems.length === 0 || isPending)}
                                    fullWidth
                                    sx={{ mt: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                                >
                                    {action === "agregar" ? "Finalizar y Crear Pedido" : "Finalizar y Modificar Pedido" }
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
        </Box>  
    );
}
