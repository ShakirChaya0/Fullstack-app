import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import EmptyOrder from "../assets/empty-order.svg"
import { useAppSelector } from "../../../shared/hooks/store"
import ControlPointIcon from "@mui/icons-material/ControlPoint"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import { useOrderActions } from "../../../shared/hooks/useOrderActions"
import type { FormEvent } from "react"
import type { LineaPedido } from "../../Order/interfaces/Order"
import { toast } from "react-toastify";
import { useMutationOrderRegistration } from "../hooks/useMutationOrder"
import GoBackButton from "../../../shared/components/GoBackButton"
import { OrderTotalAmount } from "../utils/OrderTotalAmount"
import { useNavigate } from "react-router"
import { isAModifiedOrder } from "../utils/isAModifiedOrder"

export default function ConfirmOrder() {
  const navigate = useNavigate()
  const order = useAppSelector((state) => state.order)
  const { handleAddToCart, hanldeRemoveFromCart, handleConfirmOrder } = useOrderActions()
  const { saveOrderMutation } = useMutationOrderRegistration(order)

  const handleAdd = (lp: LineaPedido) => {
    handleAddToCart(lp.producto)
  }

  const handleRemove = (name: string) => {
    hanldeRemoveFromCart({ nombreProducto: name })
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const data = Object.fromEntries(formData.entries())
      if(+data.cantidad <= 0) {
        toast.error('No se puede registrar un pedido con número de comensales menor a 0')
        return
      }
      if(data.observaciones.toString().length > 500) {
        toast.error('La observación debe tener menos de 500 caracteres')
        return
      }
      if(order.lineasPedido.length === 0) {
        toast.error('No se puede registrar un pedido vacío')
        return
      }
      handleConfirmOrder({comensales: +data.cantidad, observaciones: data.observaciones.toString()})
      //Se evalua si hubo un cambio
      if(!isAModifiedOrder(order, +data.cantidad, data.observaciones.toString())) {
        navigate('/Cliente/Menu/PedidoConfirmado')
        return
      }
      saveOrderMutation.mutate()
  }

  return (
    <section className="p-4 flex flex-col w-full items-center justify-center">
      <div className="flex justify-end w-full">
        <GoBackButton url="/Cliente/Menu/"/>
      </div>
      <div className="md:border flex flex-col justify-between py-4 md:border-gray-300 md:shadow-2xl min-h-[500px] w-full max-w-3xl md:rounded-2xl">
        <div className="flex flex-row justify-between mx-5 mb-3">
          <h1 className="text-2xl font-bold text-center text-gray-800">Mi Pedido</h1>
          <div className="flex">
            <span className="text-gray-800 font-bold text-2xl">Total:</span>
            <span className="text-orange-500 font-bold text-2xl ml-1">${OrderTotalAmount(order.lineasPedido).toFixed(2)}</span>
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-4">
          {
              order.lineasPedido?.length === 0 &&
              <>
                  <img src={EmptyOrder} alt="pedido vacio" className="m-auto w-fit"/>
                  <p className="text-center mb-4">Pedido Vacio</p>
              </>
          }
          {order.lineasPedido.map((lp) => (
            <div
              key={lp.producto._name}
              className="flex flex-col gap-2 border border-gray-300 rounded-xl shadow-sm p-3"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col max-w-[200px]">
                  <span className="font-semibold">{lp.producto._name}</span>
                  <span
                    className="
                      text-sm text-gray-600
                      max-h-[60px] 
                      overflow-y-auto 
                      pr-1
                    "
                  >
                    {lp.producto._name}
                  </span>
                  <span className="text-orange-600 font-bold">
                    ${lp.subtotal}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold">Cant: {lp.cantidad}</p>
                  <p className="text-sm font-bold">Precio: ${(lp.producto._price * lp.cantidad).toFixed(2)}</p>
                </div>
              </div>

              <div
                className="self-end border rounded-md 
                transition-all duration-200 bg-orange-500
                text-white font-medium flex flex-row justify-around 
                items-center gap-1 w-fit"
              >
                <button
                  onClick={() => handleRemove(lp.producto._name)}
                  className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105
                   hover:bg-orange-600 rounded-l-md transition-all ease-linear duration-150
                   active:bg-orange-700 active:scale-100"
                >
                  <RemoveCircleOutlineIcon/>
                </button>
                <p>{lp.cantidad}</p>
                <button
                  onClick={() => handleAdd(lp)}
                  className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105
                   hover:bg-orange-600 rounded-r-md transition-all ease-linear duration-150 
                   active:bg-orange-700 active:scale-100"
                >
                  <ControlPointIcon/>
                </button>
              </div>
            </div>
          ))}
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-3">
              <label htmlFor="cantComensales">
                Cantidad de comensales: 
              </label>
                <input required name="cantidad" type="number" placeholder="ej:12" id="cantComensales" 
                className="py-0.5 px-1 w-12 outline-0 rounded-lg bg-gray-200"
                defaultValue={order.comensales !== 0 ? order.comensales : undefined}
                onInput={(e) => {
                  if (e.currentTarget.valueAsNumber < 1) e.currentTarget.value = "1";
                }}
                />
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Observaciones: </label>
              <textarea 
              defaultValue={order.observaciones !== '' ? order.observaciones : undefined}
              name="observaciones" 
              className="bg-gray-200 rounded-2xl py-2 px-4" 
              placeholder="ej: sacale el chorizo al choripan" 
              rows={4} id=""
              onChange={(e) => {
                if (e.currentTarget.value.trim() == '') {
                  e.currentTarget.value = ''
                  return
                }  
              }}
              />
            </div>
              <button 
                className="active:bg-orange-700 hover:scale-105 relative transition-all 
                ease-linear duration-100 active:scale-95 m-auto py-2 px-4 mt-2 bg-orange-500 
                rounded-lg shadow-lg text-white font-bold cursor-pointer hover:bg-orange-600"
              >
                Confirmar Pedido
              </button>
          </form>
        </div>

        {
          order.lineasPedido?.length === 0 ?
            <div className="hidden md:block">
              <img src={EmptyOrder} alt="pedido vacio" className="m-auto w-fit"/>
              <p className="text-center mb-4">Pedido Vacio</p>

            </div>
          :
          <TableContainer component={Paper} className="hidden md:block">
              <Table>
                  <TableHead>
                      <TableRow sx={{bgcolor: "#1e2939"}}>
                        <TableCell sx={{ color: "white"}}>Producto</TableCell>
                        <TableCell sx={{ color: "white"}}>Descripción</TableCell>
                        <TableCell align="right" sx={{ color: "white"}}>Cantidad</TableCell>
                        <TableCell align="right" sx={{ color: "white"}}>Precio</TableCell>
                        <TableCell align="right" sx={{ color: "white"}}>Subtotal</TableCell>
                        <TableCell align="center" sx={{ color: "white"}}>Acciones</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody> 
                  {order.lineasPedido.map((lp) => (
                      <TableRow key={lp.producto._name}>
                          <TableCell>{lp.producto._name}</TableCell>
                          <TableCell>{lp.producto._description}</TableCell>
                          <TableCell align="right">{lp.cantidad}</TableCell>
                          <TableCell align="right">${lp.producto._price}</TableCell>
                          <TableCell align="right">${lp.subtotal.toFixed(2)}</TableCell>
                          <TableCell align="center">
                              <div
                                className="self-center border rounded-md 
                                transition-all duration-200 bg-orange-500
                                text-white font-medium flex flex-row justify-around 
                                items-center gap-1 w-fit"
                              >
                                  <button
                                    onClick={() => handleRemove(lp.producto._name)}
                                    className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105
                                      hover:bg-orange-600 rounded-l-md transition-all ease-linear duration-150
                                      active:bg-orange-700 active:scale-100"
                                  >
                                    <RemoveCircleOutlineIcon/>
                                  </button>
                                  <p>{lp.cantidad}</p>
                                  <button
                                    onClick={() => handleAdd(lp)}
                                    className="cursor-pointer h-full w-full py-1.5 px-2 bg-orange-500 hover:scale-105
                                      hover:bg-orange-600 rounded-r-md transition-all ease-linear duration-150 
                                      active:bg-orange-700 active:scale-100"
                                  >
                                    <ControlPointIcon/>
                                  </button>
                              </div>
                          </TableCell>
                      </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
        }

            <div className="hidden md:block p-2">
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div className="flex flex-row gap-3">
                      <label htmlFor="cantComensales">
                        Cantidad de comensales: 
                      </label>
                        <input required name="cantidad" type="number" min={1} id="cantComensales" placeholder="ej:1" 
                        className="py-0.5 px-1 w-12 outline-0 rounded-lg bg-gray-200"
                        defaultValue={order.comensales !== 0 ? order.comensales : undefined}
                        onInput={(e) => {
                          if (e.currentTarget.valueAsNumber < 1) e.currentTarget.value = "1";
                        }}
                        />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="">Observaciones: </label>
                      <textarea 
                        name="observaciones" 
                        className="bg-gray-200 rounded-2xl py-2 px-4 outline-0" 
                        placeholder="ej: sacale el chorizo al choripan" rows={4} 
                        id=""
                        defaultValue={order.observaciones !== '' ? order.observaciones : undefined}
                        onChange={(e) => {
                          if (e.currentTarget.value.trim() == '') {
                            e.currentTarget.value = ''
                            return
                          }  
                        }}
                      />
                    </div>
                    <button 
                      className="active:bg-orange-700 hover:scale-105 relative transition-all 
                      ease-linear duration-100 active:scale-95 m-auto py-2 px-4 mt-2 bg-orange-500 
                      rounded-lg shadow-lg text-white font-bold cursor-pointer hover:bg-orange-600"
                    >
                      Confirmar Pedido
                    </button>
                </form>
            </div>
        </div>
    </section>
  );
}