import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import { Autocomplete, TextField, Button, List, ListItem, ListItemText, IconButton, Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useProducts } from '../../Products/hooks/useProducts';
import type { Bebida, Comida } from '../../Products/interfaces/products';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useWebSocket, type OrderEmitEvent, type OrderOnEvent } from '../../../shared/hooks/useWebSocket';
import type { PedidoBackend } from '../interfaces/OrderTable';
import { consolidateOrderLines, rebuildOrderWithConsolidatedLines } from '../utils/joinUpdatedOrderLines';
import { useQueryClient } from '@tanstack/react-query';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

export default function ModifyOrder() {
    const { data: products } = useProducts();
    const navigate = useNavigate()
    const [selectedProduct, setSelectedProduct] = useState<Comida | Bebida | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const nroMesa = useParams()
    const isModifyByWaiter = useRef(false)
    const [existingOrder, setExistingOrder] = useState<PedidoBackend | null>(JSON.parse(localStorage.getItem("modifyOrder") ?? ""))
    const originalOrderRef = useRef<PedidoBackend | null>(JSON.parse(localStorage.getItem("modifyOrder") ?? ""))
    const { sendEvent, onEvent, offEvent } = useWebSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        const handleOrderUpdateByKitchen = (data: PedidoBackend) => {
            const consolidatedOrderLines = consolidateOrderLines(data.lineasPedido)
            const price = products?.find((p) => {
                existingOrder?.lineasPedido.find((lp) => lp.nombreProducto === p._name)
            })?._price ?? 1

            if (existingOrder) {
                const updatedPreviousOrder = rebuildOrderWithConsolidatedLines(existingOrder, consolidatedOrderLines, price)
                updatedPreviousOrder.idPedido = data.idPedido
                updatedPreviousOrder.estado = data.estado
                updatedPreviousOrder.observaciones = data.observaciones
    
                setExistingOrder({
                    ...updatedPreviousOrder,
                    lineasPedido: updatedPreviousOrder.lineasPedido.map((lp) => {
                        return {
                            nombreProducto: lp.nombreProducto,
                            cantidad: lp.cantidad,
                            nroLinea: lp.nroLinea,
                            tipo: lp.tipo,
                            estado: lp.estado,
                            
                        }
                    })
                })
                toast.info('La cocina ha actualizado su pedido, no se aplicó su modificación');
            }
        }



        onEvent("updatedOrderLineStatus", async (data) => {
            await queryClient.invalidateQueries({queryKey: ["waitersTable"]})
            handleOrderUpdateByKitchen(data)
            navigate("/Mozo/Mesas/")
        })
        onEvent("modifiedOrderLine", (data) => {
            setExistingOrder(data)
            if (isModifyByWaiter.current) {
                toast.success("Se modificó con éxito su Pedido")
            }
            else {
                toast.info("El cliente modificó el pedido")
            }
            isModifyByWaiter.current = false
            navigate("/Mozo/Mesas/")

        })
        onEvent("deletedOrderLine", (data) => {
            localStorage.setItem("modifyOrder", JSON.stringify(data))
            setExistingOrder(data)
            navigate("/Mozo/Mesas/")
        })
        onEvent("addedOrderLine", (data) => {
            localStorage.setItem("modifyOrder", JSON.stringify(data))
            setExistingOrder(data)
            navigate("/Mozo/Mesas/")
        })
        return () => {
            offEvent("updatedOrderLineStatus", async (data) => {
                await queryClient.invalidateQueries({queryKey: ["waitersTable"]})
                handleOrderUpdateByKitchen(data)
                navigate("/Mozo/Mesas/")
            })
            offEvent("modifiedOrderLine", (data) => {
                localStorage.setItem("modifyOrder", JSON.stringify(data))
                setExistingOrder(data)
                if (isModifyByWaiter.current) {
                    toast.success("Se modificó con éxito su Pedido")
                }
                else {
                    toast.info("El cliente modificó el pedido")
                }
                isModifyByWaiter.current = false
                navigate("/Mozo/Mesas/")
            })
            offEvent("deletedOrderLine", (data) => {
                localStorage.setItem("modifyOrder", JSON.stringify(data))
                setExistingOrder(data)
                navigate("/Mozo/Mesas/")
            })
            offEvent("addedOrderLine", (data) => {
                localStorage.setItem("modifyOrder", JSON.stringify(data))
                setExistingOrder(data)
                navigate("/Mozo/Mesas/")    
            })
        }

    }, [])

    const handleAddProduct = (): void => {
        if (selectedProduct && quantity > 0 && existingOrder) {
            const existingItemIndex = existingOrder.lineasPedido.findIndex((lp) => (lp.nombreProducto === selectedProduct._name) && lp.estado === "Pendiente");
            
            const updatedLineas = [...existingOrder.lineasPedido];
            
            if (existingItemIndex > -1) {
                // Incrementar cantidad del item existente
                updatedLineas[existingItemIndex].cantidad += quantity;
            } else {
                // Agregar nueva línea con nroLinea temporal (se asignará en backend)
                const maxNroLinea = Math.max(...existingOrder.lineasPedido.map(lp => lp.nroLinea || 0), 0);
                updatedLineas.push({
                    nombreProducto: selectedProduct._name,
                    cantidad: quantity,
                    nroLinea: maxNroLinea + 1,
                    tipo: (selectedProduct && "_type" in selectedProduct) ? selectedProduct._type : undefined,
                    estado: "Pendiente"
                });
            }

            setExistingOrder({
                ...existingOrder,
                lineasPedido: updatedLineas
            });

            setSelectedProduct(null);
            setQuantity(1);
        }
    };

    const handleRemoveItem = (nameProduct: string, lineNumber: number | undefined): void => {
        if (!existingOrder) return;
        
        const correspondingLine = existingOrder.lineasPedido.filter(
            (lp) => (lp.nombreProducto === nameProduct) && (lp.nroLinea === lineNumber)).find((lp) => lp.estado === "Pendiente");
        if (correspondingLine?.estado !== "Pendiente") {
            toast.warning("No se puede eliminar esta línea porque ya está en preparación o fue entregada");
            return;
        }

        const updatedLineas = existingOrder.lineasPedido.filter(
            (lp) => !(lp.nombreProducto === nameProduct && lp.nroLinea === lineNumber)
        );

        setExistingOrder({
            ...existingOrder,
            lineasPedido: updatedLineas
        });
    };

    const calculateTotal = (): number => {
        return +(existingOrder?.lineasPedido.reduce((total, item) => {
                const price = products?.find((p) => p._name === item.nombreProducto)?._price ?? 1
                return total + price * item.cantidad
            }, 0).toFixed(2) ?? 0)
    };

    const handleSubmitOrder = (e: FormEvent<HTMLFormElement>) => {
        isModifyByWaiter.current = true
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const data = Object.fromEntries(form.entries())
        if (+data.comensales <= 0 || +data.comensales > 50) {
            toast.warning("Cantidad de comensales invalida");
            return
        }

        if (data.observacion.toString().length > 500) {
            toast.error("La observación debe tener menos de 500 caracteres");
            return;
        }

        if (existingOrder?.lineasPedido.length === 0) {
            toast.warning("No se puede registrar un pedido vacío")
            return;
        }

        // Detectar líneas nuevas (que no estaban en la orden original)
        const newLines = existingOrder!.lineasPedido.filter(currentLine =>
            !originalOrderRef.current?.lineasPedido.some(originalLine =>
                originalLine.nombreProducto === currentLine.nombreProducto &&
                originalLine.nroLinea === currentLine.nroLinea
            )
        );

        // Detectar líneas eliminadas (que estaban en la orden original pero ya no están)
        const deletedLines = originalOrderRef.current?.lineasPedido.filter(originalLine =>
            !existingOrder!.lineasPedido.some(currentLine =>
                currentLine.nombreProducto === originalLine.nombreProducto &&
                currentLine.nroLinea === originalLine.nroLinea
            )
        ) ?? [];

        // Detectar líneas con cambios de cantidad
        const modifiedLines = existingOrder!.lineasPedido.filter(currentLine => {
            const originalLine = originalOrderRef.current?.lineasPedido.find(ol =>
                ol.nombreProducto === currentLine.nombreProducto &&
                ol.nroLinea === currentLine.nroLinea
            );
            return originalLine && originalLine.cantidad !== currentLine.cantidad;
        });

        // Detectar cambios en comensales y observaciones
        const comensalesChanged = +data.comensales !== (originalOrderRef.current?.cantidadCubiertos ?? 0);
        const observacionesChanged = (data.observacion as string) !== (originalOrderRef.current?.observaciones ?? "");

        // Función auxiliar para enviar evento y esperar respuesta
        const sendEventAndWait = (eventName: OrderEmitEvent, eventData: any, responseEventName: OrderOnEvent): Promise<void> => {
            return new Promise((resolve) => {
                const handler = () => {
                    offEvent(responseEventName, handler);
                    resolve();
                };
                onEvent(responseEventName, handler);
                sendEvent(eventName, eventData);
            });
        };

        (async () => {
            if (newLines.length > 0) {
                const orderLines = newLines.map(line => ({
                    nombre: line.nombreProducto,
                    monto: products?.find((p) => p._name === line.nombreProducto)?._price ?? 1,
                    cantidad: line.cantidad,
                    tipo: line.tipo
                }));
                await sendEventAndWait(
                    "addOrderLine",
                    { orderId: existingOrder?.idPedido, orderLines },
                    "addedOrderLine"
                );
            }

            if (deletedLines.length > 0) {
                for (const line of deletedLines) {
                    await sendEventAndWait(
                        "deleteOrderLine",
                        {
                            orderId: existingOrder?.idPedido,
                            lineNumber: line.nroLinea
                        },
                        "deletedOrderLine"
                    );
                }
            }

            // 3. Modificar la orden solo si hay cambios en cantidad, comensales u observaciones
            if (modifiedLines.length > 0 || comensalesChanged || observacionesChanged) {
                const lineasDePedido = existingOrder?.lineasPedido.map((lp) => {
                    const precio = products?.find((p) => p._name === lp.nombreProducto)?._price ?? 1
                    return {producto: lp, cantidad: lp.cantidad, estado: "Pendiente", subtotal: lp.cantidad * precio}
                })

                const orderData = {
                    comensales: +data.comensales,
                    observaciones: data.observacion as string,
                    lineasDePedido: lineasDePedido,
                    nrolineasDePedido: existingOrder?.lineasPedido.map((lp) => lp.nroLinea),
                };

                const order = {
                    orderId: existingOrder?.idPedido,
                    lineNumbers: modifiedLines.length > 0 ? orderData.nrolineasDePedido : undefined,
                    data: {
                        cantidadCubiertos: orderData.comensales,
                        observacion: orderData.observaciones === originalOrderRef.current?.observaciones ? undefined : orderData.observaciones,
                        items: modifiedLines.length > 0 ? lineasDePedido : undefined
                    }
                }
                sendEvent("modifyOrder", order)
            }
        })();
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                                    margin="normal"
                                    InputProps={{ inputProps: { min: 1 , max: 20 } }}
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
                                                     onClick={() => handleRemoveItem(item.nombreProducto, item.nroLinea)}
                                                     disabled={!isPending}
                                                     >
                                                         <DeleteIcon color={isPending ? "error" : "disabled"}  />
                                                     </IconButton>
                                                 }
                                             >
                                                 <ListItemText
                                                     primary={<Typography fontWeight="medium">{`${item.nombreProducto} (x${item.cantidad})`}</Typography>}
                                                     secondary={`${formatCurrency(+(price * item.cantidad).toFixed(2), "es-AR", "ARS")}`}
                                                 />
                                             </ListItem>
                                              {index < existingOrder.lineasPedido.length - 1 && <Divider component="li" />}
                                             </React.Fragment>
                                        )
                                    })}
                                </List>
                                 <Divider sx={{ my: 2 }} />
                                <Typography variant="h5" align="right" sx={{ mt: 2, mr: 2 }} fontWeight="bold">
                                    Total: {formatCurrency(calculateTotal(), "es-AR", "ARS")}
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
                                        InputProps={{ inputProps: { min: 1, max: 50 } }}
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
                                        inputProps={{ maxLength: 255 }}
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
