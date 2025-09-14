import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveProductToBackend } from "../services/product&PriceService";
import type { useMutationProductRegistrationProps } from "../interfaces/product&PriceInterfaces";

export function useMutationProductRegistration ({ newProduct, setNewProduct, setProductType, setModalError, setIsModalOpen }: useMutationProductRegistrationProps ) {
    const queryClient = useQueryClient();
    
    // useMutation para manejar la actualización de horarios (POST)
    const saveProductMutation = useMutation({
        mutationFn: () => saveProductToBackend(newProduct),
        onSuccess: () => {
        // Invalidar query para refrescar datos del backend
        queryClient.invalidateQueries({ queryKey: ['products'] });
        
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