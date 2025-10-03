import React, { useState, type JSX } from 'react';
import { Autocomplete, TextField, Button, List, ListItem, ListItemText, IconButton, Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useProducts } from '../../Products/hooks/useProducts';
import type { ProductsInterface } from '../../Products/interfaces/products';


interface OrderItem extends ProductsInterface {
    quantity: number;
}


export default function CreateOrder(): JSX.Element {
    const { data: products } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState<ProductsInterface | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [diners, setDiners] = useState<number>(1);
    const [observations, setObservations] = useState<string>('');

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

    const handleRemoveItem = (productId: number): void => {
        setOrderItems(orderItems.filter(item => item._productId !== productId));
    };

    const calculateTotal = (): string => {
        return orderItems.reduce((total, item) => total + item._price * item.quantity, 0).toFixed(2);
    };

    const handleSubmitOrder = (): void => {
        if (orderItems.length === 0) {
            alert('Por favor, agrega al menos un producto al pedido.');
            return;
        }

        const orderData = {
            diners,
            observations,
            items: orderItems,
            total: calculateTotal(),
        };

        console.log('Order Submitted:', orderData);
        alert('Pedido creado con éxito!');

        setOrderItems([]);
        setDiners(1);
        setObservations('');
    };


    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f9fafb', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Crear Nuevo Pedido
                </Typography>
            </Box>
            <Grid container spacing={4}>
                {/* Left side - Form to add products */}
                <Grid>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="medium">Añadir Producto</Typography>
                            <Autocomplete
                                fullWidth
                                options={products || []}
                                getOptionLabel={(option) => option._name}
                                value={selectedProduct}
                                onChange={(event: React.SyntheticEvent, newValue: ProductsInterface | null) => {
                                    setSelectedProduct(newValue);
                                }}
                                isOptionEqualToValue={(option, value) => option._productId === value._productId}
                                renderInput={(params) => <TextField {...params} label="Buscar producto" margin="normal" />}
                            />
                            <TextField
                                fullWidth
                                label="Cantidad"
                                type="number"
                                value={quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                margin="normal"
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleAddProduct}
                                disabled={!selectedProduct}
                                fullWidth
                                sx={{ mt: 2, py: 1.2, fontWeight: 'bold' }}
                            >
                                Agregar al Pedido
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right side - Order summary */}
                <Grid>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="medium">Resumen del Pedido</Typography>
                             <List sx={{ minHeight: '150px' }}>
                                {orderItems.length === 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '150px', color: 'text.secondary' }}>
                                        <Typography>El pedido está vacío</Typography>
                                    </Box>
                                )}
                                {orderItems.map((item, index) => (
                                   <React.Fragment key={item._productId}>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item._productId)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={<Typography fontWeight="medium">{`${item._name} (x${item.quantity})`}</Typography>}
                                            secondary={`$${(item._price * item.quantity).toFixed(2)}`}
                                        />
                                    </ListItem>
                                     {index < orderItems.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                             <Divider sx={{ my: 2 }} />
                            <Typography variant="h5" align="right" sx={{ mt: 2, mr: 2 }} fontWeight="bold">
                                Total: ${calculateTotal()}
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                 <TextField
                                    fullWidth
                                    label="Cantidad de Comensales"
                                    type="number"
                                    value={diners}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiners(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                    margin="normal"
                                     InputProps={{ inputProps: { min: 1 } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Observaciones del Pedido"
                                    multiline
                                    rows={3}
                                    value={observations}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setObservations(e.target.value)}
                                    margin="normal"
                                    placeholder="Ej: sin sal, punto de cocción, etc."
                                />
                            </Box>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmitOrder}
                                disabled={orderItems.length === 0}
                                fullWidth
                                sx={{ mt: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                            >
                                Finalizar y Crear Pedido
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
