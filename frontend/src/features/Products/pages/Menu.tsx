import DrinksLink from "../components/drinks/drinksLink";
import FoodsLink from "../components/foods/foodsLink";
import { OrderList } from "../components/orderList";
import { useSearchParams } from "react-router";
import fetchQR from "../services/fetchQR";
import useApiClient from "../../../shared/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@mui/material";

export default function Menu(){
    const [searchParams, setSearchParams] = useSearchParams()
    const { apiCall } = useApiClient()

    const { isLoading, error, isError } = useQuery({
        queryKey: ['qr'],
        queryFn: () =>  fetchQR(apiCall, searchParams?.get("qrToken") ?? "", Number(searchParams?.get("mesa"))),
        staleTime: Infinity,
        retry: 0,
        refetchOnMount: false
    })

    return(
        <>
            {!isLoading && !isError &&
                <div className="flex flex-1 flex-col justify-center items-center gap-5 mt-10 mb-10">
                    <FoodsLink/>
                    <DrinksLink/>
                    <OrderList/>
                </div>
            }
            {isError &&
                <div className="flex justify-center items-center mx-4 w-full">
                    <Alert severity="error">
                        {error.message}
                    </Alert>
                </div>
            }   
        </>
    ) 
}