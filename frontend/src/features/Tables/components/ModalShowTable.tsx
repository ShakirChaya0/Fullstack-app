import { type FC, Fragment, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { ITable } from '../interfaces/ITable';
import { useNavigate } from 'react-router';
import ModalQR from './ModalQR';
import { useTableMutation } from '../hooks/useTableMutation';
import SelectMethodModal from './SelectMethodModal';
import { useQueryClient } from '@tanstack/react-query';

// --- Icono de Cierre (SVG) ---
const CloseIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Props del Componente Modal ---
interface ModalShowTableProps {
  open: boolean;
  onClose: () => void;
  currentTable: ITable;
  title?: string;
}

// --- Componente ModalShowTable (Esqueleto) ---
export const ModalShowTable: FC<ModalShowTableProps> = ({ open, onClose, title, currentTable }) => {
  const navigate = useNavigate()
  const { mutate, isPending } = useTableMutation()
  const isModify = currentTable._orders?.find((o) => ((o.idMozo) && ( o.estado !== "Completado" && o.estado !== "Pagado" && o.estado !== "Pendiente_De_Pago" && o.estado !== "Pendiente_De_Cobro")))
  const isRealease =  (currentTable._orders?.at(-1) === undefined) || (currentTable._orders?.at(-1)?.estado === "Pagado")
  const queryClient = useQueryClient()

  useEffect(() => {
    (
      async () => {
        await queryClient.invalidateQueries({queryKey: ["waitersTable"]})
      }
    )()
  }, [currentTable._tableNum])

  const modalVariants: Variants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.2 }
    },
  };

  const handleGenerateCheck = async () => {
    navigate(`/Mozo/Pedido/Cuenta/${currentTable._orders?.at(-1)?.idPedido}`)
  }

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const handleCreateOrder = () => {
    localStorage.removeItem("modifyOrder")
    const url = !isModify ? `/Mozo/CargarPedido/${currentTable._tableNum}` : `/Mozo/ModificarPedido/${currentTable._tableNum}`
    if (isModify) localStorage.setItem("modifyOrder", JSON.stringify(isModify))
    navigate(`${url}`)
  }

  const handleFreeTable = () => {
    mutate({action: "updateState", _tableNum: currentTable._tableNum, _state: "Libre"})
  }

  return (
    <AnimatePresence>
      {open && ( 
        <Fragment>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            key="modal"
            className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{title ?? `Mesa ${currentTable._tableNum}`}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                aria-label="Cerrar modal"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </header>
      
            <div className="flex-grow p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Número de Mesa:</span>
                    <span className="font-bold text-lg text-gray-800">{currentTable._tableNum}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Capacidad:</span>
                    <span className="font-semibold text-gray-800">{currentTable._capacity} personas</span>
                  </div>
                   <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Estado Actual:</span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        currentTable._state === 'Libre' ? 'bg-green-100 text-green-800' : 
                        currentTable._state === 'Ocupada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentTable._state}
                    </span>
                  </div>
                </div>
                <ModalQR tableNum={currentTable._tableNum}/>
                <button 
                    onClick={handleFreeTable}
                    disabled={(!isRealease || isPending)}
                    className={`w-full px-4 py-4 text-sm mt-5 font-medium text-white 
                    ${!isRealease ? "bg-amber-950/30" : "bg-amber-600 hover:bg-amber-700 active:scale-95 active:bg-amber-800 cursor-pointer"}
                    rounded-lg transition-all`}
                >
                    Liberar Mesa
                </button>
              </div>
                        
              <div className="mt-auto flex flex-col gap-3">
                    {
                      currentTable._orders && (currentTable._orders.at(-1)?.estado === "Pendiente_De_Cobro" || currentTable._orders.at(-1)?.estado === "Pendiente_De_Pago" || currentTable._orders.at(-1)?.estado === "Completado") && 
                      <button 
                          className="w-full px-4 py-3 text-sm font-medium text-white bg-teal-600 
                          rounded-lg hover:bg-teal-700 active:scale-95 active:bg-teal-800 cursor-pointer transition-all"
                          onClick={handleGenerateCheck}
                      >
                        Generar Cuenta
                      </button>
                    }
                    { 
                      currentTable._orders && (currentTable._orders.at(-1)?.estado === "Pendiente_De_Cobro" || currentTable._orders.at(-1)?.estado === "Pendiente_De_Pago") && 
                      <SelectMethodModal currentTable={currentTable._orders.at(-1)?.idPedido}/>
                    }
                    {
                      currentTable._orders && (currentTable._orders.at(-1)?.estado !== "Pendiente_De_Cobro" && currentTable._orders.at(-1)?.estado !== "Pendiente_De_Pago") &&
                      <button 
                          onClick={handleCreateOrder}
                          className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 
                          rounded-lg hover:bg-blue-700 active:scale-95 active:bg-blue-800 cursor-pointer transition-all"
                      >
                          { !isModify ? "Agregar Pedido" : "Modificar Pedido"}
                      </button>
                    }
              </div>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}; 

