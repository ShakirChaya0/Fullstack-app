import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTables } from '../hooks/useTable';
import type { ITable } from '../interfaces/ITable';
import { ModalShowTable } from '../components/ModalShowTable';
import { CircularProgress } from '@mui/material';
import { getTablesWithOrders } from '../services/getTablesWithOrders';
import useAuth from '../../../shared/hooks/useAuth';
import { useWebSocket } from '../../../shared/hooks/useWebSocket';
import type { WaiterOrder } from '../../Order/interfaces/Order';

interface TableProps {
    tableData: ITable;
    onClick: (table: ITable) => void;
    orders: WaiterOrder[]
}


function Table({ tableData, onClick, orders }: TableProps) {
    const { _tableNum, _capacity } = tableData;

    const isAssigned = orders.find((o) => o.nroMesa === _tableNum)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(tableData);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex justify-center flex-col items-center shadow-lg 
                rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${ isAssigned ? "bg-amber-600" : "bg-red-600"}`
            
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
    const { data, isLoading, error} = useTables(getTablesWithOrders)
    const [open, setOpen] = useState(false)
    const [currentTable, setCurrentTable] = useState<ITable | null>(null)
    const [orders, setOrders] = useState< WaiterOrder[] | null>(null)
    const { user } = useAuth()
    const { onEvent, offEvent } = useWebSocket()

    const tables = data?.filter((t) => (((t._orders[0]?.idMozo === undefined) || (t._orders[0]?.idMozo === user?.idUsuario)))).sort((a, b) => a._tableNum - b._tableNum )

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
                    !error ? (
                        <div className="bg-gray-100 w-full font-sans text-gray-800 flex flex-col p-4 md:p-8">
                            { open && <div className='absolute w-full h-full bg-black opacity-50 inset-0' onClick={handleToggleModal}></div>}
                            { currentTable && <ModalShowTable onClose={handleToggleModal} open={open} currentTable={currentTable}/>}
                            <header className="mb-6">
                                <h1 className="text-4xl font-bold text-center text-gray-700">Mesas ocupadas del restaurante</h1>
                                <p className="text-center text-gray-500 mt-1">Haz click en una mesa para visualizar su información.</p>
                            </header>
                            <section className="w-full bg-white rounded-2xl shadow-lg p-6 overflow-x-auto h-full">
                              <div className="grid grid-cols-[repeat(8,200px)] place-items-center grid-rows-3 gap-6 w-full">
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
                        <h1>Error al cargar los datos</h1>
                    )
                ) : (<CircularProgress/>)
            }
        </>
    );
}

