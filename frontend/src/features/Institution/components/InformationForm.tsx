import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type Information from "../interfaces/Information";
import updateInformation from "../services/updateInformation";

export default function InformationForm({ data }: { data: Information }) {
  const [formData, setFormData] = useState<Information>({
    _informationId: 0,
    _name: "",
    _address: "",
    _CompanyName: "",
    _telefono: ""
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateInformation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Information'] });
      toast.success("Información actualizada con éxito");
    },
    onError: (err) => {
      toast.error("Error al actualizar la información");
      console.log(err);
    }
  });

  useEffect(() => {
    if (data) {
      setFormData({
        _informationId: data._informationId || 0,
        _name: data._name || "",
        _address: data._address || "",
        _CompanyName: data._CompanyName || "",
        _telefono: data._telefono || ""
      });
    }
  }, [data]);

  const handleChange = (field: keyof Information, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        Información del Restaurante
      </h2>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Nombre</label>
        <input
          type="text"
          value={formData._name}
          onChange={(e) => handleChange('_name', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Teléfono</label>
        <input
          type="tel"
          value={formData._telefono}
          onChange={(e) => handleChange('_telefono', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Dirección</label>
        <input
          type="text"
          value={formData._address}
          onChange={(e) => handleChange('_address', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="sm:text-lg font-semibold text-gray-800">Razón Social</label>
        <input
          type="text"
          value={formData._CompanyName}
          onChange={(e) => handleChange('_CompanyName', e.target.value)}
          className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isPending}
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