import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyProductToBackend, saveProductToBackend } from "../services/product&PriceService";
import type { useMutationProductModificationProps, useMutationProductRegistrationProps } from "../interfaces/product&PriceInterfaces";
import { toast } from "react-toastify";
import useApiClient from "../../../shared/hooks/useApiClient";

export function useMutationProductRegistration ({ newProduct, setNewProduct, setProductType, setModalError, setIsModalOpen }: useMutationProductRegistrationProps ) {
    const queryClient = useQueryClient();
    const { apiCall } = useApiClient();
    
    // useMutation para manejar el registro de productos (POST)
    const saveProductMutation = useMutation({
        mutationFn: () => saveProductToBackend(apiCall, newProduct),
        onSuccess: () => {
        // Invalidar query para refrescar datos del backend
        queryClient.invalidateQueries({ 
            queryKey: ['products'],
            exact: false // Esto invalida ['products', 1, 10], ['products', 2, 10], etc. Es decir todas las variaciones para que todas las páginas esten correctamente actualizadas
        });
        
        // Limpiando los estados
        setNewProduct({
            nombre: '',
            descripcion: '',
            estado: 'Disponible',
            precio: 0,
            esAlcoholica: undefined,
            tipo: undefined,
            esSinGluten: undefined,
            esVegetariana: undefined,
            esVegana: undefined
        })

        setProductType(undefined)

        setModalError('')

        toast.success('Producto registrado con exito')

        // Cerrando la modal
        setIsModalOpen(false)
        },
        onError: (err: Error) => {
            if(err.message.indexOf('409') !== -1) setModalError('El nombre del producto ya existe')
        }
    });

    return { saveProductMutation }
}

export function useMutationProductModification ({ newProduct, productBefModification, setModalError, onClose}: useMutationProductModificationProps ) {
    const queryClient = useQueryClient();
    const { apiCall } = useApiClient();
    
    // useMutation para manejar la actualización de horarios (POST)
    const modifyProductMutation = useMutation({
        mutationFn: () => modifyProductToBackend(apiCall, newProduct, productBefModification),
        onSuccess: () => {
        // Al modificar un producto, debemos invalidar todas las queries relacionadas
        // porque el producto modificado puede aparecer/desaparecer de diferentes búsquedas/páginas
        queryClient.invalidateQueries({ 
            queryKey: ['products'],
            exact: false // Invalida todas las variaciones: ['products'], ['products', page, limit], ['products', page, limit, search]
        });

        setModalError('')

        toast.success('Producto modificado con exito')

        // Cerrando la modal
        onClose()
        },
        onError: (err: Error) => {
            if(err.message.indexOf('409') !== -1) setModalError('El nombre del producto ya existe')
        }
    });

    return { modifyProductMutation }
}