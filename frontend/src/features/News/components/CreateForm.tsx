import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import createNews from "../services/createNews";
import { toast } from "react-toastify";

type FormData = {
  Titulo: string,
  Descripcion: string,
  FechaInicio: string,
  FechaFin: string
};

export default function CreateForm({currentPage}: {currentPage: number}) {
    const {
      register,           
      handleSubmit,       
      watch,
      formState: { errors }
    } = useForm<FormData>();

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
      mutationFn: createNews,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['News', currentPage] });
        toast.success("Se creo una novedad con exito")
      },
      onError: (err) => {
        toast.error("Error al crear la novedad")
        console.log(err)
      }
    })


    const onSubmit =  (data: FormData) => {
        mutate({_title: data.Titulo, _description: data.Descripcion, _startDate: data.FechaInicio, _endDate: data.FechaFin})
    };

    const fechaInicioValue = watch("FechaInicio");

    return (

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Título</label>
            <input
              {...register("Titulo", { required: "El Título es obligatorio" })}
              placeholder="Escribe el título..."
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.Titulo && (
              <p className="text-base text-red-500">{errors.Titulo.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Descripción</label>
            <textarea
              {...register("Descripcion", {
                required: "La descripción es obligatoria",
              })}
              placeholder="Escribe la descripción..."
              rows={3}
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            />
            {errors.Descripcion && (
              <p className="text-base text-red-500">{errors.Descripcion.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Fecha de inicio</label>
            <input
              type="date"
              {...register("FechaInicio", {
                required: "La fecha de inicio es obligatoria",
                validate: (value) =>
                  new Date(value) >= new Date(new Date().toDateString()) ||
                  "Debe ser mayor o igual a hoy",
              })}
              min={new Date().toISOString().split("T")[0]}
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.FechaInicio && (
              <p className="text-base text-red-500">{errors.FechaInicio.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Fecha de fin</label>
            <input
              type="date"
              {...register("FechaFin", {
                required: "La fecha de fin es obligatoria",
                validate: (value) => {
                  const hoy = new Date(new Date().toDateString());
                  const inicio = new Date(fechaInicioValue);
                  const fin = new Date(value);

                  if (fin < hoy) return "Debe ser mayor o igual a hoy";
                  if (fechaInicioValue && fin < inicio)
                    return "Debe ser mayor o igual a la fecha de inicio";

                  return true;
                },
              })}
              min={new Date().toISOString().split("T")[0]}
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.FechaFin && (
              <p className="text-base text-red-500">{errors.FechaFin.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition cursor-pointer"
          >
            Crear
          </button>
        </form>
  );
}
