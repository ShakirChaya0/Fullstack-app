import { useMemo } from "react";
import { useForm } from "react-hook-form";
import useAvailableSchedule from "../hooks/useAvailableSchedule";
import { ReservationFormSkeleton } from "../pages/SkeletonReservationClient";

export interface ReservationFormData {
  FechaReserva: string;
  HoraReserva: string;
  CantidadComensales: number;
}

interface ReservationFormProps {
  onFormSubmit: (data: ReservationFormData, resetCallback?: () => void) => void;
  isMutating: boolean;
}

  function parseLocalDateFromInput(value: string, time?: string): Date {
    const [year, month, day] = value.split("-").map(Number);
    let hours = 0, minutes = 0;
    if (time) {
      [hours, minutes] = time.split(":").map(Number);
    }
    return new Date(year, month - 1, day, hours, minutes); // hora local
  }

function getWeekdayLocal(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // hora local
  return date.toLocaleDateString("es-ES", { weekday: "long" });
}

export default function ReservationForm({ onFormSubmit, isMutating }: ReservationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ReservationFormData>({
    mode: "onChange",
    defaultValues: { CantidadComensales: 1 },
  });

  const selectedDate = watch("FechaReserva");
  const { availableSchedules, queryLoading, queryError } = useAvailableSchedule(selectedDate);

  // Generador de intervalos de tiempo para **todos los horarios del día**
  const timeSlots = useMemo(() => {
    if (!availableSchedules || availableSchedules.length === 0 || !selectedDate) return [];

    const slots: string[] = [];

    availableSchedules.forEach(schedule => {
      let start = parseLocalDateFromInput(selectedDate, schedule.horaApertura);
      const end = parseLocalDateFromInput(selectedDate, schedule.horaCierre);

      if (end < start) end.setDate(end.getDate() + 1);

      while (start <= end) {
        slots.push(start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
        start.setMinutes(start.getMinutes() + 30);
      }
    });

    return slots;
  }, [availableSchedules, selectedDate]);

  const onSubmit = (data: ReservationFormData) => {
    onFormSubmit(data, () => reset());
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Crea tu Reserva</h1>
        <p className="text-gray-500 mt-1">Es rápido y fácil.</p>
      </div>

      {queryLoading ? (
        <ReservationFormSkeleton />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Fecha */}
          <div>
            <label htmlFor="FechaReserva" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              id="FechaReserva"
              min={new Date().toISOString().split("T")[0]}
              {...register("FechaReserva", { required: "La fecha es obligatoria" })}
              className={`w-full p-3 border rounded-lg transition focus:ring-2 outline-none ${
                errors.FechaReserva
                  ? "border-red-500 ring-red-300"
                  : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
              }`}
            />
            {errors.FechaReserva && <p className="text-red-600 text-xs mt-1">{errors.FechaReserva.message}</p>}
          </div>

          {/* Información de horarios */}
          {selectedDate && !queryError && (
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              {availableSchedules.length > 0 ? (
                <p className="text-sm text-amber-800">
                  El <span className="font-bold">{getWeekdayLocal(selectedDate)} </span> 
                    abrimos de <span className="font-bold">{availableSchedules[0].horaApertura} </span> 
                    a <span className="font-bold">{availableSchedules[0].horaCierre}</span>.
                </p>
              ) : (
              <p className="text-sm text-gray-600 font-medium">
                 Lo sentimos, estamos cerrados ese día.
                </p>
              )}
            </div>
          )}
          {queryError && <p className="text-red-600 text-xs text-center">{queryError.message}</p>}

          {/* Hora y Comensales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="HoraReserva" className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <select
                id="HoraReserva"
                {...register("HoraReserva", { required: "La hora es obligatoria" })}
                disabled={!timeSlots.length}
                className={`w-full p-3 border rounded-lg transition focus:ring-2 outline-none ${
                  errors.HoraReserva
                    ? "border-red-500 ring-red-300"
                    : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
                }`}
              >
                <option value="">Seleccionar</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.HoraReserva && <p className="text-red-600 text-xs mt-1">{errors.HoraReserva.message}</p>}
            </div>

            <div>
              <label htmlFor="CantidadComensales" className="block text-sm font-medium text-gray-700 mb-1">
                Comensales
              </label>
              <input
                type="number"
                id="CantidadComensales"
                min={1}
                {...register("CantidadComensales", {
                  required: "Nº de comensales obligatorio",
                  valueAsNumber: true,
                  min: { value: 1, message: "Mínimo 1 comensal" },
                })}
                className={`w-full p-3 border rounded-lg transition focus:ring-2 outline-none ${
                  errors.CantidadComensales
                    ? "border-red-500 ring-red-300"
                    : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
                }`}
              />
              {errors.CantidadComensales && <p className="text-red-600 text-xs mt-1">{errors.CantidadComensales.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting || isMutating}
            className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-300 disabled:cursor-not-allowed"
          >
            {isSubmitting || isMutating ? "Procesando..." : "Crear Reserva"}
          </button>
        </form>
      )}
    </div>
  );
}
