import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { useMutationDeletePriceProps, useMutationPriceRegistrationProps } from "../interfaces/product&PriceInterfaces";
import { deletePrice, savePriceToBackend } from "../services/product&PriceService";
import { toast } from "react-toastify";

export function useMutationPriceRegistration ({ newPrice, setNewPrice, setModalError, setIsModalOpen }: useMutationPriceRegistrationProps) {
    const queryClient = useQueryClient();

    const savePriceMutation = useMutation({
        mutationFn: () => savePriceToBackend(newPrice),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['priceList', newPrice.idProducto]})
            // Invalidamos la query de productos para actualizar los precios
            queryClient.invalidateQueries({ 
                queryKey: ['products'],
                exact: false 
            })

            // Solo reseteamos el monto, mantenemos el idProducto
            setNewPrice(prev => ({
                ...prev,
                monto: 0
            }))

            setModalError('')
            toast.success('Precio registrado con exito')
            setIsModalOpen(false)
        },
        onError: (err: Error) => {
            throw new Error(`Error al registrar el precio: ${err.message}`)
        }
    })

    return { savePriceMutation }
}

export function useMutationDeletePrice ({ idProducto, selectedPrice, setIsModalOpen }: useMutationDeletePriceProps) {
    const queryClient = useQueryClient()

    const deletePriceMutation = useMutation({
        mutationFn: () => {
            if (!selectedPrice) {
                throw new Error('No hay precio seleccionado para eliminar')
            }
            return deletePrice(idProducto, selectedPrice.fechaVigencia)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['priceList', idProducto]})
            // Invalidamos la query de productos para actualizar los precios
            queryClient.invalidateQueries({ 
                queryKey: ['products'],
                exact: false 
            })
            toast.success('Precio eliminado con exito')
            setIsModalOpen(false)
        }
    })

    return { deletePriceMutation }
}