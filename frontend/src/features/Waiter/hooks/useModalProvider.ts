import { createContext, useContext } from "react"
import type { Waiter } from "../interfaces/Waiters"

type Props = { 
    waiters?: Waiter, 
    fn: (data: Waiter) => Promise<Waiter>, 
    msgs: {SuccessMsg: string, ErrorMsg: string}, 
    ButtonName: string
}

export const ModalContext = createContext<Props>({
  waiters: {
    idMozo: "",
    nombreUsuario: "",
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    contrasenia: ""
  },
  fn: async (data: Waiter) => {
    return {
        idMozo: data.idMozo ?? "",
        nombreUsuario: data.nombreUsuario ?? "",
        nombre: data.nombre ?? "",
        apellido: data.apellido ?? "",
        dni: data.dni ?? "",
        telefono: data.telefono ?? "",
        email: data.email ?? "",
        contrasenia: data.contrasenia ?? ""
    }
  },
  msgs: { SuccessMsg: "", ErrorMsg: "" },
  ButtonName: "",
})

export const useModalProvider = () => useContext(ModalContext)
