import { useMemo, useState } from "react";
import { useDrinks } from "../hooks/useDrinks";
import FilterDrinks from "./filterDrinks";
import ProductsCard from "./ProductsCard";
import { SkeletonBody } from "./skeletonBody";
import EmptyOrder from "../assets/empty-order.svg"
import { OrderList } from "./orderList";

function DrinksList () {
    const {isLoading, isError, drinks} = useDrinks();
    const pedidos = false
    const filtros = ["Alcoholicas", "No_Alcoholicas"]
    const [query, setQuery] = useState("")
    console.log(isError, drinks)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value
        setQuery(query)
    }
    
    const filteredDrinks = useMemo(() => {
        return drinks?.filter((dat) => dat._name.includes(query)) ?? [] ;
    }, [drinks, query])

    return(
        <>
        {
            !isLoading ? (
            <section className="flex-1 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 p-4 w-full">
                <div className="border border-gray-300 rounded-2xl p-4 shadow-xl">
                    { !isError && <FilterDrinks handleChange={handleChange}/>}
                    { isError && <h1 className="flex w-full h-full justify-center items-center text-2xl text-red-600">Error al cargar los datos del menu</h1>}
                    {
                        filtros.map((filtro) => {
                            const drinksFiltered = filteredDrinks.map((drink) => (drink._isAlcoholic ? "Alcoholica" : "No_Alcoholica" == filtro))
                            if(drinksFiltered.length == 0) return null
                            return (
                                <>  
                                    <span className="w-full h-0.5 bg-gray-300 block my-4" id={filtro}></span>
                                    <h2 className="max-w-4xl mx-auto text-black text-2xl">{filtro.replace("_", " ").toUpperCase()}</h2>
                                    <div className="grid grid-cols-1 col-start-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                        {
                                            filteredDrinks.map((drink) => (
                                                <ProductsCard key={drink._productId} food={drink}/>
                                            ))
                                        }
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
                <OrderList/>
            </section>
            ): (<SkeletonBody/>)
        }
        </>
    )
}

export default DrinksList