import type { Suggestion } from "../interfaces/Suggestion";

export default function SuggestionCard({ suggestion }: { suggestion: Suggestion } ) {
    return(
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg/30 overflow-hidden border border-transparent hover:border-amber-500 transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
                <div>
                    <p className="text-xs font-semibold text-amber-600 uppercase">Producto</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">{suggestion._product._name}</h3>
                    <p className="text-gray-600 text-sm mt-2">{suggestion._product._description}</p>
                </div>
                            
                <hr className="my-4 border-gray-200" />

                <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-700">
                        <p className="font-semibold">Desde:</p>
                        <p>{new Date(suggestion._dateFrom).toLocaleDateString()}</p>
                    </div>
                    <div className="text-gray-700 text-right">
                        <p className="font-semibold">Hasta:</p>
                        <p>{new Date(suggestion._dateTo).toLocaleDateString()}</p>
                    </div>
                </div>
                            
                <div className="mt-6 flex justify-end">
                    <button className="bg-amber-600 cursor-pointer text-white font-semibold py-2 px-5 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors duration-200">
                        Modificar
                    </button>
                </div>
            </div>
        </div>
    )
}