import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type Policy from "../interfaces/Policy";
import updatePolicy from "../services/updatePolicy";

type PolicyFormProps = {
  data: Policy;
};

export default function PolicyForm({ data }: PolicyFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updatePolicy,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["Policy"] });
      toast.success("Políticas actualizadas con éxito");
    },
    onError: (err) => {
      toast.error("No se pudo actualizar las políticas");
      console.log(err);
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Policy>({
    defaultValues: {
      _policyId: 0,
      _minutosTolerancia: 0,
      _horarioMaximoDeReserva: "",
      _horasDeAnticipacionParaCancelar: 0,
      _horasDeAnticipacionParaReservar: 0,
      _limiteDeNoAsistencias: 0,
      _cantDiasDeshabilitacion: 0,
      _porcentajeIVA: 0,
      _montoCubiertosPorPersona: 0,
    },
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = (formData: Policy) => {
    mutate(formData);
  };

  if (!data) return <p className="text-center text-gray-500">Cargando...</p>;

  const fields: { label: string; name: keyof Policy; type: "number" | "text"; min?: number; max?: number }[] = [
    { label: "Minutos de Tolerancia", name: "_minutosTolerancia", type: "number", min: 0, max: 120 },
    { label: "Horario Máximo de Reserva", name: "_horarioMaximoDeReserva", type: "text" },
    { label: "Horas de Anticipación para Cancelar", name: "_horasDeAnticipacionParaCancelar", type: "number", min: 0, max: 168 },
    { label: "Horas de Anticipación para Reservar", name: "_horasDeAnticipacionParaReservar", type: "number", min: 0, max: 8760 },
    { label: "Límite de No Asistencias", name: "_limiteDeNoAsistencias", type: "number", min: 1, max: 20 },
    { label: "Días de Deshabilitación", name: "_cantDiasDeshabilitacion", type: "number", min: 1, max: 365 },
    { label: "Porcentaje de IVA", name: "_porcentajeIVA", type: "number", min: 0, max: 100 },
    { label: "Monto Cubiertos por Persona", name: "_montoCubiertosPorPersona", type: "number", min: 0, max: 10000 },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg bg-white w-full max-w-4xl">
      <h2 className="col-span-full text-xl font-bold text-center mb-4">Configuración de Políticas</h2>

      {fields.map((field) => (
        <div className="flex flex-col gap-2" key={field.name}>
          <label className="sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <input
            type={field.type}
            {...register(field.name, {
              required: "Este campo es obligatorio",
              valueAsNumber: field.type === "number",
              min: field.min ? { value: field.min, message: `Debe ser al menos ${field.min}` } : undefined,
              max: field.max ? { value: field.max, message: `No puede ser mayor a ${field.max}` } : undefined,
            })}
            className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isPending}
          />
          {errors[field.name] && <span className="text-red-500">{errors[field.name]?.message}</span>}
        </div>
      ))}

      <button
        type="submit"
        className="col-span-full w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer"
      >
        Guardar
      </button>
    </form>
  );
}
