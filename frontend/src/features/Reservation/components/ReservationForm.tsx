import { useQuery } from "@tanstack/react-query";
import { getScheduleData } from "../../Schedules/shared/sheduleService";
import useReservationMutation from "../hooks/userReservationMutation";
import { useForm } from 'react-hook-form';

type FormData = {
    FechaReserva: string, // Ver si tengo que combertirlo por el backend
    HoraReserva: string // falta cambiarlo 
    CantidadComensales: number
}

interface ReservetionProps {
    onClose?: () => void; 
    onError: (message: string | null) => void;
}

export default function ReservationForm({ onError}: ReservetionProps ) {

        const { data: backendSchedules, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['schedules'],
        queryFn: getScheduleData
    });

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>()

    // Obtenemos la fecha que eligio el cliente
    const selectedDate = watch('FechaReserva');

      // Calculo el día de la semana (0 = domingo, 1 = lunes, etc.)
    const selectedDay = selectedDate ? new Date(selectedDate).getDay() : null;

    //Filtrar los horarios segun el dia de la fecha seleccionado
    const filterSchedule = backendSchedules ? backendSchedules.filter( ( s: any ) => s.diaSemana === selectedDay ) : [];


    const { mutate } = useReservationMutation({ 
        handleError:onError, 
        reservation: undefined
    });

    const onSubmit = (data: FormData) => {
        console.log(data)
        mutate({
            _reserveDate: new Date(data.FechaReserva), 
            _reserveTime: data.HoraReserva, 
            _commensalsNumber: data.CantidadComensales
        }); 

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
                            {
                                errors.FechaReserva && (
                                    <p className="text-red-500 text-sm mt-1">{errors.FechaReserva.message}</p>
                                )
                            }
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Hora
                        </label>
                        <select {...register('HoraReserva', {
                            required: "Debe seleccionar una hora"
                        }

                        )}>

                        </select>
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
                                <p className="text-red-500 text-sm mt-1">{errors.CantidadComensales.message}</p>
                            )
                        }
                    </div>
                    <button
                        type="submit"
                        disabled= { isSubmitting }
                        className="bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-600 focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-colors font-medium mt-2"
                    >
                        Reservar Mesa
                    </button>
                </form>
            </div>
        </div>
    );
}