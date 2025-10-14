import type { OrderStatus } from "../interfaces/Order";

export function StatusIndicator({currentStatus}: { currentStatus: OrderStatus }){
        const steps = [
            { key: 'Solicitado', label: 'Solicitado' },
            { key: 'En_Preparacion', label: 'En preparación' },
            { key: 'Completado', label: 'Completado' },
        ];

        // Helper para determinar el índice del estado actual
        const getStatusIndex = (currentStatus: OrderStatus) => steps.findIndex(step => step.key === currentStatus);
        const currentStepIndex = getStatusIndex(currentStatus);

        return (
            <>
                <div className="flex justify-between items-start w-full max-w-xl mx-auto mt-8 mb-12 px-4 relative">
                    {steps.map((step, index) => {
                        const isActive = index === currentStepIndex;
                        const isComplete = index < currentStepIndex;
                        
                        // Estilos del Círculo (Dot): Fijo, sin pulso.
                        const dotClass = isComplete
                            ? 'bg-green-500 shadow-lg shadow-green-300' 
                            : isActive
                            ? 'bg-orange-500 shadow-xl shadow-orange-300 scale-105' // Activo es naranja y ligeramente más grande (fijo)
                            : 'bg-gray-400'; 
                        
                        // Estilos de la Barra de Progreso Segmentada.
                        let barFillClass = '';

                        if (isComplete) {
                            barFillClass = 'bg-green-500';
                        } else if (isActive) {
                            barFillClass = 'bg-orange-500';
                        } else {
                            barFillClass = 'bg-gray-200';
                        }

                        return (
                            <div key={step.key} className="flex flex-col items-center flex-shrink-0 w-1/3 px-2">
                                {/* Círculo Indicador */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 transform mb-2 ${dotClass}`}>
                                    {isComplete ? (
                                        // SVG de Checkmark para pasos completados
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                
                                {/* Título/Etiqueta */}
                                <span className={`text-xs md:text-sm text-center transition-colors duration-500 whitespace-nowrap mb-2 
                                        ${isActive ? 'font-extrabold text-orange-600' : isComplete ? 'text-green-600 font-semibold' : 'text-gray-600 font-medium'}`}
                                >
                                    {step.label}
                                </span>

                                {/* Barra de Progreso Segmentada con Border Radius */}
                                <div className={`w-full h-2 rounded-full transition-colors duration-500 ${barFillClass} animate-pulse border border-gray-300 shadow-inner`}>
                                    {/* La barra usa rounded-full para los bordes circulares */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };


