import { useForm } from 'react-hook-form';
import type { BackendSchedule } from "../../Schedules/types/scheduleTypes";
import useAvailableSchedule from "../hooks/useAvailableSchedule";
import ReservationFormSkeleton from '../pages/SkeletonReservationClient';

export type FormData = {
  FechaReserva: string;
  HoraReserva: string;
  CantidadComensales: number;
};

interface ReservationProps {
  onError: (message: string | null) => void;
  onFormSubmit: (data: FormData) => void;
}

export default function ReservationForm({ onFormSubmit }: ReservationProps) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    mode: "onChange",
  });

  const selectedDate = watch("FechaReserva");
  const { availableSchedules, queryLoading, queryError, weekday } = useAvailableSchedule(selectedDate);

  if (queryLoading) {
    return <ReservationFormSkeleton />;
  }

  const onSubmit = (data: FormData) => {
    onFormSubmit(data);
    reset({ FechaReserva: "", HoraReserva: "", CantidadComensales: 1 });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Registrar Reserva
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Fecha */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
              Fecha
            </label>
            <input
              type="date"
              {...register("FechaReserva", {
                required: "La fecha de la reserva es obligatoria",
                validate: (value) => {
                  const today = new Date().toISOString().split("T")[0];
                  return value >= today || "La fecha no puede ser anterior a hoy";
                },
              })}
              className={`border rounded-lg p-3 w-full text-sm sm:text-base focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition ${
                errors.FechaReserva ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.FechaReserva && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.FechaReserva.message}
              </p>
            )}
          </div>

          {/* Hora */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
              Hora
            </label>
            {queryLoading ? (
              <p className="text-gray-500 text-sm">Cargando horarios...</p>
            ) : queryError ? (
              <p className="text-red-500 text-sm">Error al cargar horarios</p>
            ) : (
              <select
                {...register("HoraReserva", {
                  required: "Debe seleccionar una hora",
                })}
                disabled={weekday === undefined || weekday === null}
                className={`border rounded-lg p-3 w-full text-sm sm:text-base focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition ${
                  errors.HoraReserva ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" className="text-gray-500">
                  Seleccione un horario
                </option>
                {availableSchedules.map((horario: BackendSchedule) => (
                  <option
                    key={horario.horaApertura}
                    value={horario.horaApertura}
                    className="text-gray-800"
                  >
                    {horario.horaApertura} - {horario.horaCierre}
                  </option>
                ))}
              </select>
            )}
            {errors.HoraReserva && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.HoraReserva.message}
              </p>
            )}
          </div>

          {/* Cantidad de comensales */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
              Número de comensales
            </label>
            <input
              type="number"
              placeholder="Ej: 4"
              min="1"
              {...register("CantidadComensales", {
                required: "La cantidad de comensales es obligatoria",
                min: {
                  value: 1,
                  message: "Debe ser al menos 1 comensal",
                },
              })}
              className={`border rounded-lg p-3 w-full text-sm sm:text-base focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition ${
                errors.CantidadComensales ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.CantidadComensales && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.CantidadComensales.message}
              </p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 
                       focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 cursor-pointer 
                       transition-colors font-medium mt-2 text-sm sm:text-base w-full"
          >
            Registrar Reserva
          </button>
        </form>
      </div>
    </div>
  );
}
