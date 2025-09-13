import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { useAppSelector } from "../../../shared/hooks/store"
import ControlPointIcon from "@mui/icons-material/ControlPoint"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import { useOrderActions } from "../../../shared/hooks/useOrderActions"
import type { LineaPedido } from "../../../store/slices/orderSlice"
import type { FormEvent } from "react"

export default function ConfirmOrder() {
  const order = useAppSelector((state) => state.order)
  const { handleAddToCart, hanldeRemoveFromCart } = useOrderActions()

  const handleAdd = (lp: LineaPedido) => {
    handleAddToCart({
      nombreProducto: lp.nombreProducto,
      descripcion: lp.descripcion,
      precio: lp.precio,
    })
  }

  const handleRemove = (name: string) => {
    hanldeRemoveFromCart({ nombreProducto: name })
  };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        console.log(Object.fromEntries(formData.entries()))
    }

  return (
    <section className="p-4 flex w-full items-center justify-center">
      <div className="md:border py-4 md:border-gray-300 md:shadow-2xl min-h-[500px] w-full max-w-3xl md:rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">Mi Pedido</h1>

        <div className="md:hidden flex flex-col gap-4">
          {order.lineasPedido.map((lp) => (
            <div
              key={lp.nombreProducto}
              className="flex flex-col gap-2 border rounded-xl shadow-sm p-3"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col max-w-[200px]">
                  <span className="font-semibold">{lp.nombreProducto}</span>
                  <span
                    className="
                      text-sm text-gray-600
                      max-h-[60px] 
                      overflow-y-auto 
                      pr-1
                    "
                  >
                    {lp.descripcion}
                  </span>
                  <span className="text-orange-600 font-bold">
                    ${lp.subtotal}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold">Cant: {lp.cantidad}</p>
                  <p className="text-sm font-bold">Precio: ${lp.precio}</p>
                </div>
              </div>

              <div
                className="self-center border group hover:border-orange-500 
                rounded-md hover:bg-white transition-all duration-200 bg-orange-500
                text-white font-medium flex flex-row justify-around items-center gap-1 w-full"
              >
                <button
                  onClick={() => handleAdd(lp)}
                  className="cursor-pointer h-full w-full py-1.5 px-2"
                >
                  <ControlPointIcon className="group-hover:text-orange-500" />
                </button>
                <p className="group-hover:text-orange-500">{lp.cantidad}</p>
                <button
                  onClick={() => handleRemove(lp.nombreProducto)}
                  className="cursor-pointer h-full w-full py-1.5 px-2"
                >
                  <RemoveCircleOutlineIcon className="group-hover:text-orange-500" />
                </button>
              </div>
            </div>
          ))}
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-3">
              <label htmlFor="cantComensales">
                Cantidad de comensales: 
              </label>
                <input required name="cantidad" type="number" placeholder="ej:12" id="cantComensales" className="py-0.5 px-1 w-12 outline-0 rounded-lg bg-gray-300"/>
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Observaciones: </label>
              <textarea name="observaciones" className="bg-gray-300 rounded-2xl py-2 px-4" placeholder="ej: sacale el chorizo al choripan" rows={4} id=""/>
            </div>
            <div className="flex justify-center">
              <button className="py-2 px-4 bg-orange-500 rounded-lg shadow-lg text-white font-bold">Confirmar Pedido</button>
            </div>
          </form>
        </div>

        <TableContainer component={Paper} className="hidden md:block">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.lineasPedido.map((lp) => (
                <TableRow key={lp.nombreProducto}>
                  <TableCell>{lp.nombreProducto}</TableCell>
                  <TableCell>{lp.descripcion}</TableCell>
                  <TableCell align="right">{lp.cantidad}</TableCell>
                  <TableCell align="right">${lp.precio}</TableCell>
                  <TableCell align="right">${lp.subtotal}</TableCell>
                  <TableCell align="center">
                    <div
                      className="self-center border group hover:border-orange-500 
                      rounded-md hover:bg-white transition-all duration-200 bg-orange-500
                      text-white font-medium flex flex-row justify-around items-center gap-1 w-fit"
                    >
                      <button
                        onClick={() => handleAdd(lp)}
                        className="cursor-pointer h-full w-full py-1.5 px-2"
                      >
                        <ControlPointIcon className="group-hover:text-orange-500" />
                      </button>
                      <p className="group-hover:text-orange-500">{lp.cantidad}</p>
                      <button
                        onClick={() => handleRemove(lp.nombreProducto)}
                        className="cursor-pointer h-full w-full py-1.5 px-2"
                      >
                        <RemoveCircleOutlineIcon className="group-hover:text-orange-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
}