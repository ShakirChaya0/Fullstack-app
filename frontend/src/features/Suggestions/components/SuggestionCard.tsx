import dateParser from "../../../shared/utils/dateParser";
import type { Suggestion } from "../interfaces/Suggestion";
import ModalUpdateSuggestions from "./ModalUpdateSuggestions";

export default function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
    return(
        <div className="w-full sm:w-2xs max-w-sm h-full bg-white rounded-xl shadow-lg/30 overflow-hidden border border-transparent border-t-3 border-t-amber-500 hover:border-amber-500 transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 h-full flex flex-col justify-between">
                <div className="h-full">
                    <p className="text-xs font-semibold text-amber-600 uppercase">Producto</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">{suggestion._product._name}</h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{suggestion._product._description}</p>
                </div>
                            
                <hr className="my-4 border-gray-200" />

                <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-700">
                        <p className="font-semibold">Desde:</p>
                        <p>{dateParser(suggestion._dateFrom)}</p>
                    </div>
                    <div className="text-gray-700 text-right">
                        <p className="font-semibold">Hasta:</p>
                        <p>{dateParser(suggestion._dateTo)}</p>
                    </div>
                </div>
                            
                <div className="mt-6 flex justify-end">
                    <ModalUpdateSuggestions suggestion={suggestion}/>
                </div>
            </div>
        </div>
    )
}