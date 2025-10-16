import { useForm } from "react-hook-form";
import { useModalProvider } from "../hooks/useModalProvider";
import { useMutationWaiter } from "../hooks/useMutationWaiter";
import { usePage } from "../hooks/usePage";
import { CircularProgress } from "@mui/material";

type FormData = {
    nombreUsuario: string,
    contrasenia: string,
    email: string,
    nombre: string,
    apellido: string,
    dni: string,
    telefono: string,
};

export default function ActionForm({handleClose}: {handleClose: () => void}) {
    const {
      register,           
      handleSubmit,       
      formState: { errors }
    } = useForm<FormData>();
    const {currentPage, query} = usePage()

    const {fn, msgs, waiters, ButtonName} = useModalProvider()

    const { mutate, isLoading, failureReason } = useMutationWaiter({fn: fn, currentPage: currentPage, SuccessMsg: msgs.SuccessMsg, ErrorMsg: msgs.ErrorMsg, query: query})

    const onSubmit = (data: FormData) => {
        mutate({idMozo: waiters?.idMozo, nombreUsuario: data.nombreUsuario.trim(), 
            contrasenia: data.contrasenia.trim(), email: data.email.trim(), 
            nombre: data.nombre.trim(), apellido: data.apellido.trim(), 
            dni: data.dni.trim(), telefono: data.telefono.trim()})
          handleClose()
    }

return (
    <>
        <p className="text-base text-red-500">{failureReason?.message}</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        >
          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Nombre De Usuario</label>
            <input
              {...register("nombreUsuario", {required: "El nombre de usuario es obligatorio"})}
              placeholder="Escribe el nombre de usuario..."
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={waiters?.nombreUsuario}
            />
            {errors.nombreUsuario && <p className="text-base text-red-500">{errors.nombreUsuario.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Contraseña</label>
            <input
              {...register("contrasenia", {
                      required: "La contraseña es obligatoria",
                      minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres." },
                      maxLength: { value: 100, message: "La contraseña no puede tener más de 100 caracteres." },
                      pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                          message: "Debe incluir una mayúscula, una minúscula y un número."
                      }
                    })}
              placeholder="Escribe la contraseña..."
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              defaultValue={waiters?.contrasenia}
            />
            {errors.contrasenia && <p className="text-base text-red-500">{errors.contrasenia.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Nombre</label>
            <input
              {...register("nombre", {required: "El nombre es obligatorio"})}
              placeholder="Escribe un nombre..."
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={waiters?.nombre}
            />
            {errors.nombre && <p className="text-base text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Apellido</label>
            <input
              {...register("apellido", {required: "El apellido es obligatorio"})}
              placeholder="Escribe un apellido..."
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={waiters?.apellido}
            />
            {errors.apellido && <p className="text-base text-red-500">{errors.apellido.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">DNI</label>
            <input
              {...register("dni", {required: "El dni es obligatorio", maxLength: 10})}
              placeholder="Escribe un DNI..."
              type="number"
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={waiters?.dni}
            />
            {errors.dni && <p className="text-base text-red-500">{errors.dni.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Teléfono</label>
            <input
              {...register("telefono", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^\+\d{6,15}$/,
                  message: "El teléfono debe comenzar con + y contener solo números (mínimo 6 dígitos)",
                },
              })}
              placeholder="Escribe un teléfono..."
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={waiters?.telefono}
            />
            {errors.telefono && <p className="text-base text-red-500">{errors.telefono.message}</p>}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="sm:text-lg font-semibold text-gray-800">Email</label>
            <input
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "El formato del email no es válido",
                },
              })}
              placeholder="Escribe el email del usuario..."
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={waiters?.email}
            />
            {errors.email && <p className="text-base text-red-500">{errors.email.message}</p>}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className={`w-full text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg shadow-lg transition ${isLoading ? "bg-teal-700" : "bg-teal-700 hover:bg-teal-800 cursor-pointer"}`}
              disabled={isLoading}
            >
                {
                  !isLoading ? ButtonName
                  :(
                    <CircularProgress color="inherit"/>
                  )
                }
            </button>
          </div>
        </form>
    </>
  );
}
