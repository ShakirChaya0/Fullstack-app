import { useForm } from 'react-hook-form';
import type { BackendSchedule } from "../../Schedules/types/scheduleTypes";
import useAvailableSchedule from "../hooks/useAvailableSchedule";
import ReservationFormSkeleton from '../pages/SkeletonReservationClient';

export type FormData = {
    FechaReserva: string, // Ver si tengo que combertirlo por el backend
    HoraReserva: string // falta cambiarlo 
    CantidadComensales: number
}

interface ReservetionProps {
    onError: (message: string | null) => void;
    onFormSubmit: (data: FormData) => void; 
}

export default function ReservationForm({ onFormSubmit}: ReservetionProps ) {

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        mode: "onChange",
    })
    
    // Obtenemos la fecha que eligio el cliente
    const selectedDate = watch('FechaReserva');
    const {availableSchedules, queryLoading, queryError, weekday} = useAvailableSchedule(selectedDate)

    if(queryLoading) {
        return <ReservationFormSkeleton></ReservationFormSkeleton>
    }

    const onSubmit = (data: FormData) => {
        onFormSubmit(data)
        reset({FechaReserva: "", HoraReserva: "", CantidadComensales: 1})
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Registrar Reserva
                </h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Fecha
                        </label>
                        <input
                            type="date"
                            {...register("FechaReserva", {
                                required: "La fecha de la reserva es obligatoria",
                                validate: (value) => {
                                    const today = new Date().toISOString().split('T')[0];
                                    return value >= today || 'La fecha no puede ser anterior a hoy';
                                }
                            })}
                            className={`border rounded-lg p-3 w-full focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition ${
                                errors.FechaReserva ? 'border-red-500' : 'border-gray-300'
                            }`}
                            />
                            {errors.FechaReserva && (
                              <p
                                className={`text-red-500 text-sm mt-1 transition-all duration-300 ease-in-out max-h-10 overflow-hidden ${
                                  errors.FechaReserva ? "opacity-100" : "opacity-0"
                                }`}
                              >
                                {errors.FechaReserva.message}
                              </p>
                            )}
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Hora
                        </label>
                        {queryLoading ? (
                                <p>Cargando horarios...</p>
                            ) : queryError ? (
                                <p className="text-red-500">Error al cargar horarios</p>
                            ) : (
                                    <select {...register('HoraReserva', {
                                        required: "Debe seleccionar una hora",
                                    })}
                                    className={`border rounded-lg p-3 w-full focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition ${
                                        errors.HoraReserva? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={!weekday}
                                    >
                                        <option value="">Seleccione un horario</option>
                                        {availableSchedules.map((horario: BackendSchedule) => (
                                          <option key={horario.horaApertura} value={horario.horaApertura}>
                                            {horario.horaApertura} - {horario.horaCierre}
                                          </option>
                                        ))}
                                    </select>
                                )}
                                { 
                                    errors.HoraReserva && (
                                    <p
                                        className={`text-red-500 text-sm mt-1 transition-all duration-300 ease-in-out max-h-10 overflow-hidden ${
                                        errors.HoraReserva ? "opacity-100" : "opacity-0"
                                        }`}
                                    >
                                        {errors.HoraReserva.message}
                                    </p>
                                )}
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Número de comensales
                        </label>
                        <input
                            type="number"
                            placeholder="Ej: 4"
                            {...register("CantidadComensales", {
                                required: "La cantidad de de comensales es obligatoria ", 
                                min: {
                                    value: 1, 
                                    message: "Debe ser al menos 1 comensal"
                                }
                                }
                            )}
                            className={`border rounded-lg p-3 w-full focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition ${
                                errors.CantidadComensales ? 'border-red-500' : 'border-gray-300'
                            }`}
                            min="1"
                        />
                        { 
                            errors.CantidadComensales && (
                            <p
                                className={`text-red-500 text-sm mt-1 transition-all duration-300 ease-in-out max-h-10 overflow-hidden ${
                                errors.CantidadComensales ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                {errors.CantidadComensales.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled= { isSubmitting }
                        className="bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-600 focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 cursor-pointer transition-colors font-medium mt-2"
                    >
                        Reservar Mesa
                    </button>
                </form>
            </div>
        </div>
    );
}