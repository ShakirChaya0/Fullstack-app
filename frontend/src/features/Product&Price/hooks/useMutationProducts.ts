import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyProductToBackend, saveProductToBackend } from "../services/product&PriceService";
import type { useMutationProductModificationProps, useMutationProductRegistrationProps } from "../interfaces/product&PriceInterfaces";

export function useMutationProductRegistration ({ newProduct, setNewProduct, setProductType, setModalError, setIsModalOpen }: useMutationProductRegistrationProps ) {
    const queryClient = useQueryClient();
    
    // useMutation para manejar la actualización de horarios (POST)
    const saveProductMutation = useMutation({
        mutationFn: () => saveProductToBackend(newProduct),
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

        // Cerrando la modal
        setIsModalOpen(false)
        },
        onError: (err: Error) => {
            throw new Error(`Error al registrar el producto: ${err.message}`);
        }
    });

    return { saveProductMutation }
}

export function useMutationProductModification ({ newProduct, productBefModification, setModalError, onClose, currentPage, limit }: useMutationProductModificationProps ) {
    const queryClient = useQueryClient();
    
    // useMutation para manejar la actualización de horarios (POST)
    const modifyProductMutation = useMutation({
        mutationFn: () => modifyProductToBackend(newProduct, productBefModification),
        onSuccess: () => {
        // Si tenemos la página específica, invalidamos solo esa página
        // Si no, todas
        if (currentPage !== undefined && limit !== undefined) {
            queryClient.invalidateQueries({ 
                queryKey: ['products', currentPage, limit],
                exact: true // Invalida solo esta página
            });
        } else {
            queryClient.invalidateQueries({ 
                queryKey: ['products'],
                exact: false 
            });
        }

        setModalError('')

        // Cerrando la modal
        onClose()
        },
        onError: (err: Error) => {
            throw new Error(`Error al registrar el producto: ${err.message}`);
        }
    });

    return { modifyProductMutation }
}