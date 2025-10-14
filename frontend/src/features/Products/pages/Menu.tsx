import DrinksLink from "../components/drinks/drinksLink";
import FoodsLink from "../components/foods/foodsLink";
import { OrderList } from "../components/orderList";
import { useSearchParams } from "react-router";
import fetchQR from "../services/fetchQR";
import useApiClient from "../../../shared/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import WaitingForQR from "../components/WaitingForQR";

export default function Menu(){
    const [searchParams, setSearchParams] = useSearchParams()
    const { apiCall } = useApiClient()

    const { isLoading, isError } = useQuery({
        queryKey: ['qr'],
        queryFn: () =>  fetchQR(apiCall, searchParams?.get("qrToken") ?? "", Number(searchParams?.get("mesa"))),
        staleTime: Infinity,
        retry: 0,
        refetchOnMount: false
    })

    return(
        <>
            {!isLoading && !isError &&
                <div className="flex flex-1 flex-col justify-center items-center gap-5">
                    <FoodsLink/>
                    <DrinksLink/>
                    <OrderList/>
                </div>
            }
            {isError &&
                <div className="w-full max-w-md bg-gray-50 rounded-2xl shadow-xl p-6 md:p-8 text-center m-10">
        
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Escanear Código QR</h1>
                    <p className="text-gray-500 mt-2">Asegurate de solicitarle el QR al mozo</p>

                    <div className="mt-4 mb-8">
                        <div id="error-message" className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg text-left flex items-center" role="alert">
                            <div>
                                <p className="font-bold">¡QR no reconocido!</p>
                                <p className="text-sm">No pudimos leer el código. Asegúrate de que esté bien iluminado y vuelve a intentarlo.</p>
                            </div>
                        </div>

                        <WaitingForQR/>
                    </div>

                </div>
            }   
        </>
    ) 
}