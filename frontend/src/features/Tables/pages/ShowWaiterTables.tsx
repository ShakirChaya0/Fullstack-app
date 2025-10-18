import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ITable } from '../interfaces/ITable';
import { ModalShowTable } from '../components/ModalShowTable';
import { CircularProgress } from '@mui/material';
import { getTablesWithOrders } from '../services/getTablesWithOrders';
import useAuth from '../../../shared/hooks/useAuth';
import { useWebSocket } from '../../../shared/hooks/useWebSocket';
import type { OrderStatus, WaiterOrder } from '../../Order/interfaces/Order';
import { useWaitersTables } from '../hooks/useWaitersTable';

interface TableProps {
    tableData: ITable;
    onClick: (table: ITable) => void;
    orders: WaiterOrder[]
}

const tableState = {
        "Solicitado": "bg-blue-500", 
        "En_Preparacion": "bg-yellow-500",
        "Completado": "bg-emerald-500",       
        "Pendiente_De_Pago": "bg-orange-500",
        "Pendiente_De_Cobro": "bg-amber-600", 
        "Pagado": "bg-green-600",   
        "Ningun pedido": "bg-red-600"         
};

function Table({ tableData, onClick, orders }: TableProps) {
    const { _tableNum, _capacity } = tableData;

    const isAssigned = orders.find((o) => o.nroMesa === _tableNum)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(tableData);
    };
    
    const bgColor = isAssigned ? tableState[tableData._orders?.at(-1)?.estado ?? "Solicitado"] : "bg-red-600"
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex justify-center flex-col items-center shadow-lg 
                rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${bgColor}`
            
            }
            onClick={handleClick}
            style={{ width: 180, height: 90, borderRadius: '0.5rem' }}
        >
            <span className="font-bold text-white text-xl">#{_tableNum}</span>
            <span className="text-sm text-white/80">({_capacity} asientos)</span>
        </motion.div>
    );
}

export default function ShowWaiterTables() {
    const { data, isLoading, isError} = useWaitersTables(getTablesWithOrders)
    const [open, setOpen] = useState(false)
    const [currentTable, setCurrentTable] = useState<ITable | null>(null)
    const [orders, setOrders] = useState<WaiterOrder[] | null>(null)
    const { onEvent, offEvent } = useWebSocket()
    const { user } = useAuth()

    const tables = data?.filter((t) => {
          const orders = t._orders ?? []
    
          if ( t._state === "Ocupada"){
              if (orders.length === 0) return true
            
              if (orders.some((o) => o.idMozo === user?.idUsuario)) return true
          }

        
          return false
        })?.sort((a, b) => a._tableNum - b._tableNum)

    const handleToggleModal = useCallback(() => {
        setOpen(!open)
    }, [setOpen, open])

    useEffect(() => {
        onEvent("waiterOrders", (data) => setOrders(data))

        return () => {
            offEvent("waiterOrders", (data) => setOrders(data))
        }
    }, [])

    const handleSelectTable = useCallback((table: ITable) => {
        setOpen(!open)
        setCurrentTable(table)
    }, [setOpen, open]);
    
    return (
        <>
            {
                !isLoading ? (
                    !isError ? (
                        tables?.length !== 0 ? (
                            <div className="bg-gray-100 w-full font-sans text-gray-800 flex flex-col p-4 md:p-8">
                                { open && <div className='absolute w-full h-full bg-black opacity-50 inset-0' onClick={handleToggleModal}></div>}
                                { currentTable && <ModalShowTable onClose={handleToggleModal} open={open} currentTable={currentTable}/>}
                                <header className="mb-6 flex flex-col w-full">
                                    <div className='self-center justify-self-center'>
                                        <h1 className="text-4xl font-bold text-center text-gray-700">Mesas ocupadas del restaurante</h1>
                                        <p className="text-center text-gray-500 mt-1">Haz click en una mesa para visualizar su información.</p>
                                    </div>
                                    <div className="bg-gray-100 flex items-center justify-center p-4 font-sans">
                                      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                                        <h1 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
                                          Estados de los pedidos de cada mesa
                                        </h1>
                                        <ul className="flex flex-wrap gap-y-4 gap-x-6">
                                          {(["Solicitado", "En_Preparacion", "Completado", "Pendiente_De_Pago", "Pendiente_De_Cobro", "Pagado", "Ningun pedido"] as OrderStatus[]).map((status) => (
                                            <li key={status} className="flex items-center text-sm">
                                              <span className={`w-3 h-3 rounded-full mr-3 ${tableState[status]}`}></span>
                                              <span className="text-gray-700">
                                                {status.replaceAll("_", " ")}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                </header>
                                <section className="w-full bg-white rounded-2xl shadow-lg p-6 overflow-x-auto h-full">
                                  <div className="flex flex-wrap justify-center items-center gap-6 w-full">
                                    {tables?.map(table => (
                                      <Table
                                        key={table._tableNum}
                                        tableData={table}
                                        onClick={handleSelectTable}
                                        orders={orders ?? []}
                                      />
                                    ))}
                                  </div>
                                </section>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full items-center justify-center  bg-gray-100 text-center p-4">
                                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full">
                                    <svg className="w-20 h-20 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <h2 className="mt-6 text-2xl font-bold text-gray-800">No hay mesas ocupadas en este momento</h2>
                                    <p className="mt-2 text-gray-600">
                                        Espere a que se ocupe alguna
                                    </p>
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="mt-8 px-6 py-3 bg-blue-600 cursor-pointer text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                                    >
                                        Recargar Página
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col w-full items-center justify-center  bg-gray-100 text-center p-4">
                            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full">
                                <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h2 className="mt-6 text-2xl font-bold text-gray-800">¡Ups! Algo salió mal</h2>
                                <p className="mt-2 text-gray-600">
                                    No pudimos cargar los datos de las mesas en este momento.
                                </p>
                                <p className="mt-1 text-gray-500 text-sm">
                                    Por favor, revisa tu conexión a internet e intenta recargar la página.
                                </p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="mt-8 px-6 py-3 bg-blue-600 cursor-pointer text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                                >
                                    Recargar Página
                                </button>
                            </div>
                        </div>
                    )
                ) : (<CircularProgress/>)
            }
        </>
    );
}

