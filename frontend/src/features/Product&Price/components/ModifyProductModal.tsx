import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Checkbox,
    Typography,
    Alert,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useRef, useState } from "react";
import type {
    ModifyProductModalProps,
    ProductWithoutPrice,
} from "../interfaces/product&PriceInterfaces";
import { isValidProduct } from "../utils/isValidProduct";
import { useMutationProductModification } from "../hooks/useMutationProducts";
import { ProductTogglerModification } from "./ProductTogglerModification";

export function ModifyProductModal({
    isOpen,
    product,
    onClose,
}: ModifyProductModalProps) {
    //Guardando el valor original del producto
    const productBefModification = useRef<ProductWithoutPrice | null>(null);

    // Inicializar el valor original solo la primera vez
    if (productBefModification.current === null) {
        productBefModification.current = {
            idProducto: product.idProducto,
            nombre: product.nombre,
            descripcion: product.descripcion,
            estado: product.estado,
            esAlcoholica: product.esAlcoholica,
            tipo: product.tipo,
            esSinGluten: product.esSinGluten,
            esVegetariana: product.esVegetariana,
            esVegana: product.esVegana,
        };
    }

    // Estado para manejar el error del formulario
    const [modalError, setModalError] = useState("");

    // Estados para el formulario
    const [newProduct, setNewProduct] = useState<ProductWithoutPrice>({
        idProducto: product.idProducto,
        nombre: product.nombre,
        descripcion: product.descripcion,
        estado: product.estado,
        esAlcoholica: product.esAlcoholica,
        tipo: product.tipo,
        esSinGluten: product.esSinGluten,
        esVegetariana: product.esVegetariana,
        esVegana: product.esVegana,
    });

    const { modifyProductMutation } = useMutationProductModification({
        newProduct,
        productBefModification,
        setModalError,
        onClose,
    });

    const handleCloseModal = () => {
        onClose();
    };

    const handleSubmit = () => {
        if (
            !isValidProduct(newProduct, newProduct.tipo ? "Comida" : "Bebida")
        ) {
            setModalError("Todos los campos deben ser completados");
            return;
        }
        if (newProduct.nombre.length < 3) {
            setModalError(
                "El nombre debe tener una longitud de más de 2 caracteres",
            );
            return;
        }
        if (newProduct.nombre.length > 30) {
            setModalError(
                "El nombre no puede tener una longitud mayor a 30 caracteres",
            );
            return;
        }
        if (newProduct.descripcion.length < 3) {
            setModalError(
                "La descripcion debe tener una longitud de más de 3 caracteres",
            );
            return;
        }
        if (newProduct.descripcion.length > 255) {
            setModalError(
                "La nombre debe tener una longitud de más de 2 caracteres",
            );
            return;
        }
        //Solo ejecuto el mutation si el producto cambio al menos un valor respecto al original
        if (
            JSON.stringify(newProduct) ===
            JSON.stringify(productBefModification.current)
        ) {
            onClose();
            return;
        }
        modifyProductMutation.mutate();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "10px",
                        padding: "8px",
                    },
                },
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(4px)", // Para difuminar el fondo
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "black",
                }}
            >
                <ModeEditIcon sx={{ mb: "5px" }} /> Modificar Producto
                {modalError && <Alert severity="error">{modalError}</Alert>}
            </DialogTitle>

            <DialogContent>
                <div className="flex flex-col">
                    <Typography
                        variant="h6"
                        sx={{ color: "#1e2939", mb: "1rem" }}
                    >
                        Modifique lo que desee de su producto.
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ color: "#1e2939", mb: "0.5rem" }}
                    >
                        Campos básicos{" "}
                        <Typography
                            variant="subtitle1"
                            sx={{ color: "red", display: "inline" }}
                        >
                            *
                        </Typography>
                    </Typography>

                    {/* Campos básicos */}
                    <div className="flex flex-col justify-between gap-4 mb-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Nombre del Producto
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Salmón a la Parrilla"
                                maxLength={30}
                                className="w-full px-3 py-2 h-[50px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                                defaultValue={newProduct.nombre}
                                onChange={(e) => {
                                    if (
                                        e.currentTarget.value.trim() == "" &&
                                        e.currentTarget.value.startsWith(" ")
                                    ) {
                                        e.currentTarget.value = "";
                                        return;
                                    }
                                    if (modalError) setModalError("");
                                    setNewProduct((prev) => {
                                        const productModify = { ...prev };
                                        const newName = e.target.value.trim();
                                        productModify.nombre = newName;
                                        return productModify;
                                    });
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Descripción
                            </label>
                            <textarea
                                placeholder="Describe tu producto..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-vertical"
                                defaultValue={newProduct.descripcion}
                                onChange={(e) => {
                                    if (
                                        e.currentTarget.value.trim() == "" &&
                                        e.currentTarget.value.startsWith(" ")
                                    ) {
                                        e.currentTarget.value = "";
                                        return;
                                    }
                                    if (modalError) setModalError("");
                                    setNewProduct((prev) => {
                                        const productModify = { ...prev };
                                        const newDescription =
                                            e.target.value.trim();
                                        productModify.descripcion =
                                            newDescription;
                                        return productModify;
                                    });
                                }}
                            />
                        </div>
                    </div>

                    {/* Manejo Disponibilidad */}
                    <div className="w-full mb-4">
                        <Typography
                            variant="subtitle1"
                            sx={{ color: "#1e2939", mb: "0.5rem" }}
                        >
                            Disponiblidad{" "}
                            <Typography
                                variant="subtitle1"
                                sx={{ color: "red", display: "inline" }}
                            >
                                *
                            </Typography>
                        </Typography>
                        <div className="flex flex-row justify-around">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            newProduct.estado === "Disponible"
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                if (modalError)
                                                    setModalError("");
                                                setNewProduct((prev) => ({
                                                    ...prev,
                                                    estado: "Disponible",
                                                }));
                                            }
                                        }}
                                        sx={{
                                            color: "#6b7280",
                                            "&.Mui-checked": {
                                                color: "#009689",
                                            },
                                        }}
                                    />
                                }
                                label="Disponible"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            newProduct.estado ===
                                            "No_Disponible"
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                if (modalError)
                                                    setModalError("");
                                                setNewProduct((prev) => ({
                                                    ...prev,
                                                    estado: "No_Disponible",
                                                }));
                                            }
                                        }}
                                        sx={{
                                            color: "#6b7280",
                                            "&.Mui-checked": {
                                                color: "#009689",
                                            },
                                        }}
                                    />
                                }
                                label="No Disponible"
                            />
                        </div>
                    </div>

                    <ProductTogglerModification
                        product={product}
                        newProduct={newProduct}
                        setNewProduct={setNewProduct}
                    ></ProductTogglerModification>
                </div>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: "0.5rem 1rem",
                    mt: "0.5rem",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "5px",
                }}
            >
                <Button
                    onClick={handleCloseModal}
                    variant="outlined"
                    sx={{
                        borderColor: "#6b7280",
                        color: "#6b7280",
                        "&:hover": {
                            borderColor: "#374151",
                            backgroundColor: "#6a7282",
                            color: "white",
                        },
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: "#059669",
                        "&:hover": { backgroundColor: "#047857" },
                    }}
                >
                    <div className="block sm:hidden">
                        <ModeEditIcon />
                    </div>
                    <span className="hidden sm:block">Modificar Producto</span>
                </Button>
            </DialogActions>
        </Dialog>
    );
}
