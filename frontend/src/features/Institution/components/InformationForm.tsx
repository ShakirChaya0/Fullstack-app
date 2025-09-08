import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type Information from "../interfaces/Information";
import updateInformation from "../services/updateInformation";

export default function InformationForm({ data }: { data: Information }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateInformation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["Information"] });
      toast.success("Información actualizada con éxito");
    },
    onError: (err) => {
      toast.error("Error al actualizar la información");
      console.log(err);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Information>({
    defaultValues: {
      _informationId: 0,
      _name: "",
      _address: "",
      _CompanyName: "",
      _telefono: "",
    },
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = (formData: Information) => {
    // Sanitize: trim fields antes de enviar
    const payload: Information = {
      ...formData,
      _name: formData._name?.trim(),
      _CompanyName: formData._CompanyName?.trim(),
      _address: formData._address?.trim(),
      _telefono: formData._telefono?.trim(),
    };
    mutate(payload);
  };

  if (!data) return <p className="text-center text-gray-500">Cargando...</p>;

  const fields: {
    label: string;
    name: keyof Information;
    type: "text" | "tel";
    rules: object;
  }[] = [
    {
      label: "Nombre del Restaurante",
      name: "_name",
      type: "text",
      rules: {
        required: "El nombre es obligatorio",
        minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
        // evita cualquier dígito en el string
        pattern: { value: /^[^\d]+$/, message: "No se permiten números en el nombre" },
      },
    },
    {
      label: "Dirección",
      name: "_address",
      type: "text",
      rules: {
        required: "La dirección es obligatoria",
        minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
        // la dirección puede tener números (número de calle), por eso no ponemos pattern que bloquee dígitos
      },
    },
    {
      label: "Razón Social",
      name: "_CompanyName",
      type: "text",
      rules: {
        required: "La razón social es obligatoria",
        minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
        pattern: { value: /^[^\d]+$/, message: "No se permiten números en la razón social" },
      },
    },
    {
      label: "Teléfono de Contacto",
      name: "_telefono",
      type: "tel",
      rules: {
        required: "El teléfono es obligatorio",
        minLength: { value: 5, message: "Debe tener al menos 5 caracteres" },
        maxLength: { value: 15, message: "No puede exceder los 15 caracteres" },
        pattern: {
          value: /^\+?\d+$/,
          message: "Solo números y puede incluir un + al inicio",
        },
      },
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg bg-white w-full max-w-4xl"
    >
      <h2 className="col-span-full text-xl font-bold text-center mb-4">
        Información del Restaurante
      </h2>

      {fields.map((field) => (
        <div className="flex flex-col gap-2" key={field.name}>
          <label className="sm:text-lg font-semibold text-gray-800">{field.label}</label>
          <input
            type={field.type}
            {...register(field.name, field.rules)}
            className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isPending}
          />
          {errors[field.name] && (
            <span className="text-red-500">{errors[field.name]?.message}</span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="col-span-full w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer"
        disabled={isPending}
      >
        Guardar
      </button>
    </form>
  );
}
