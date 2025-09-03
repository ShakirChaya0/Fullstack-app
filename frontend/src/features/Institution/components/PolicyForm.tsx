import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type Policy from "../interfaces/Policy";
import updatePolicy from "../services/updatePolicy";

export default function PolicyForm({ data }: { data: Policy }) {
  const [formData, setFormData] = useState<Policy>({
    _policyId: 0,
    _minutosTolerancia: 0,
    _horarioMaximoDeReserva: "",
    _horasDeAnticipacionParaCancelar: 0,
    _horasDeAnticipacionParaReservar: 0,
    _limiteDeNoAsistencias: 0,
    _cantDiasDeshabilitacion: 0,
    _porcentajeIVA: 0,
    _montoCubiertosPorPersona: 0
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updatePolicy,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Policy'] });
      toast.success("Políticas actualizadas con éxito");
    },
    onError: (err) => {
      toast.error("Error al actualizar las políticas");
      console.log(err);
    }
  });

  useEffect(() => {
    if (data) {
      setFormData({
        _policyId: data._policyId || 0,
        _minutosTolerancia: data._minutosTolerancia || 0,
        _horarioMaximoDeReserva: data._horarioMaximoDeReserva || "",
        _horasDeAnticipacionParaCancelar: data._horasDeAnticipacionParaCancelar || 0,
        _horasDeAnticipacionParaReservar: data._horasDeAnticipacionParaReservar || 0,
        _limiteDeNoAsistencias: data._limiteDeNoAsistencias || 0,
        _cantDiasDeshabilitacion: data._cantDiasDeshabilitacion || 0,
        _porcentajeIVA: data._porcentajeIVA || 0,
        _montoCubiertosPorPersona: data._montoCubiertosPorPersona || 0
      });
    }
  }, [data]);

  const handleChange = (field: keyof Policy, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  if (!data) return <p className="text-center text-gray-500">Cargando...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg bg-white w-full max-w-4xl"
    >
      <h2 className="col-span-full text-xl font-bold text-center mb-4">
        Configuración de Políticas
      </h2>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Minutos de Tolerancia</label>
        <input
          type="number"
          value={formData._minutosTolerancia}
          onChange={(e) => handleChange('_minutosTolerancia', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
          min={0}
          max={120}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Horario Máximo de Reserva</label>
        <input
          type="text"
          value={formData._horarioMaximoDeReserva}
          onChange={(e) => handleChange('_horarioMaximoDeReserva', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Horas de Anticipación para Cancelar</label>
        <input
          type="number"
          value={formData._horasDeAnticipacionParaCancelar}
          onChange={(e) => handleChange('_horasDeAnticipacionParaCancelar', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
          min={0}
          max={168}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Horas de Anticipación para Reservar</label>
        <input
          type="number"
          value={formData._horasDeAnticipacionParaReservar}
          onChange={(e) => handleChange('_horasDeAnticipacionParaReservar', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
          min={0}
          max={8760}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Límite de No Asistencias</label>
        <input
          type="number"
          value={formData._limiteDeNoAsistencias}
          onChange={(e) => handleChange('_limiteDeNoAsistencias', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
          min={1}
          max={20}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Días de Deshabilitación</label>
        <input
          type="number"
          value={formData._cantDiasDeshabilitacion}
          onChange={(e) => handleChange('_cantDiasDeshabilitacion', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
          min={1}
          max={365}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Porcentaje de IVA</label>
        <input
          type="number"
          value={formData._porcentajeIVA}
          onChange={(e) => handleChange('_porcentajeIVA', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
          min={0}
          max={100}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Monto Cubiertos por Persona</label>
        <input
          type="number"
          value={formData._montoCubiertosPorPersona}
          onChange={(e) => handleChange('_montoCubiertosPorPersona', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
          min={0}
          max={10000}
        />
      </div>

      <button
        type="submit"
        className="col-span-full w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer"
      >
        Guardar
      </button>
    </form>
  );
}
