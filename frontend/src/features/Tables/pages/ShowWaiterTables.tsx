import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useTables } from '../hooks/useTable';
import type { ITable, statusTable } from '../interfaces/ITable';
import { ModalShowTable } from '../components/ModalShowTable';
import { CircularProgress } from '@mui/material';

interface Status {
    id: statusTable;
    label: string;
    color: string;
    textColor: string;
}

interface TableProps {
    tableData: ITable;
    onClick: (table: ITable) => void;
}

const STATUSES: Status[] = [
    { id: 'Libre', label: 'Disponible', color: 'bg-green-500', textColor: 'text-green-800' },
    { id: 'Ocupada', label: 'Ocupada', color: 'bg-red-500', textColor: 'text-red-800' },
    { id: 'Libre', label: 'Reservada', color: 'bg-yellow-400', textColor: 'text-yellow-800' },
    { id: 'Libre', label: 'Limpiando', color: 'bg-blue-400', textColor: 'text-blue-800' },
];

const STATUS_MAP: Record<statusTable, Status> = STATUSES.reduce((acc, status) => {
    acc[status.id] = status;
    return acc;
}, {} as Record<statusTable, Status>);

function Table({ tableData, onClick }: TableProps) {
    const { _tableNum, _state, _capacity } = tableData;

    const statusInfo = STATUS_MAP[_state];

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
            className={`flex justify-center flex-col items-center shadow-lg rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${statusInfo.color}`}
            onClick={handleClick}
            style={{ width: 180, height: 90, borderRadius: '0.5rem' }}
        >
            <span className="font-bold text-white text-xl">#{_tableNum}</span>
            <span className="text-sm text-white/80">({_capacity} asientos)</span>
        </motion.div>
    );
}

export default function ShowWaiterTables() {
    const { tables, loading, error} = useTables()
    const [open, setOpen] = useState(false)
    const [currentTable, setCurrentTable] = useState<ITable | null>(null)

    const handleToggleModal = useCallback(() => {
        setOpen(!open)
    }, [setOpen, open])


    const handleSelectTable = useCallback((table: ITable) => {
        setOpen(!open)
        setCurrentTable(table)
    }, [setOpen, open]);
    
    return (
        <>
            {
                !loading ? (
                    !error ? (
                        <div className="bg-gray-100 w-full font-sans text-gray-800 flex flex-col p-4 md:p-8">
                            { open && <div className='absolute w-full h-full bg-black opacity-50 inset-0' onClick={handleToggleModal}></div>}
                            <ModalShowTable onClose={handleToggleModal} open={open} currentTable={currentTable!}/>
                            <header className="mb-6">
                                <h1 className="text-4xl font-bold text-center text-gray-700">Plano de Mesas del Restaurante</h1>
                                <p className="text-center text-gray-500 mt-1">Haz click en una mesa para cambiar su estado.</p>
                            </header>
                            <section className="w-full bg-white rounded-2xl shadow-lg p-6 overflow-x-auto h-full">
                              <div className="grid grid-cols-[repeat(8,200px)] place-items-center grid-rows-3 gap-6 w-full">
                                {tables.map(table => (
                                  <Table
                                    key={table._tableNum}
                                    tableData={table}
                                    onClick={handleSelectTable}
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

