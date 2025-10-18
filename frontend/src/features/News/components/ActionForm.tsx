import { useForm } from "react-hook-form";
import { usePage } from "../hooks/usePage";
import { useMutationNews } from "../hooks/useMutationNews";
import { useModalProvider } from "../hooks/useModalProvider";
import { CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  Titulo: string,
  Descripcion: string,
  FechaInicio: string,
  FechaFin: string
};

function parseLocalDateFromInput(value: string): Date | null {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map((p) => Number(p));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0); 
}

function getLocalISODate(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
}

const today = new Date();
const minDate = getLocalISODate(today); 


export default function ActionForm({handleClose}: {handleClose: () => void}) {
    const {currentPage, filter, query} = usePage()
    const {
      register,           
      handleSubmit,       
      watch,
      formState: { errors }
    } = useForm<FormData>();

    const { fn, msgs, news, ButtonName } = useModalProvider()

    const { mutate, isLoading, failureReason, isError } = useMutationNews({fn, currentPage, SuccessMsg: msgs.SuccessMsg, ErrorMsg: msgs.ErrorMsg, query, filter})

    const onSubmit =  (data: FormData) => {
      mutate({_newsId: news?._newsId, _title: data.Titulo.trim(), _description: data.Descripcion.trim(), _startDate: data.FechaInicio.trim(), _endDate: data.FechaFin.trim()})
      if (!isError && !isLoading) handleClose()
    };

    const fechaInicioValue = watch("FechaInicio");

    return (
      <>
        <AnimatePresence>
          {
            failureReason?.message ? (
            <motion.div className="w-full rounded-md min-h-8 flex items-center pl-3 border border-red-600 bg-rose-200"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{ duration: 0.3 }}
            >
              <p className="text-base text-red-600">{failureReason?.message}</p>
            </motion.div>
            ): (<></>)
          }
        </AnimatePresence>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <div className="flex flex-col gap-2">
            <label className="sm:text-lg font-semibold text-gray-800">Título</label>
            <input
                {...register("Titulo", {required: "El Título es obligatorio", minLength: {value: 6, message: "El titulo debe tener 6 caracteres como minimo"}})}
                placeholder="Escribe el título..."
                className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                defaultValue={news?._title}
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
                  minLength: {value: 12, message: "La descripcion debe tener 12 caracteres como minimo"}
                })}
                placeholder="Escribe la descripción..."
                rows={3}
                className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                defaultValue={news?._description}
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
                validate: (value) => {
                  const inputDate = parseLocalDateFromInput(value); 
                  if (!inputDate) return "Formato de fecha inválido";
                
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                
                  return inputDate >= today || "Debe ser mayor o igual a hoy";
                },
              })}
              min={minDate}
              className="px-2 py-1 sm:px-4 sm:py-3 sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              defaultValue={news?._endDate
                  ? getLocalISODate(new Date(news._endDate))
                  : ""}
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
                defaultValue={news?._endDate
                    ? new Date(news._endDate).toISOString().split("T")[0]
                    : ""}
            />
            {errors.FechaFin && (
                <p className="text-base text-red-500">{errors.FechaFin.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className={`flex flex-col items-center w-ful text-white font-medium sm:font-bold sm:text-lg py-2 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition ${isLoading ? "bg-teal-700" : "bg-teal-700 hover:bg-teal-800 cursor-pointer"}`}
            disabled={isLoading}
          >
            {
              !isLoading ? ButtonName
              :(
                <CircularProgress color="inherit"/>
              )
            }
          </button>
        </form>
      </>
  );
}
