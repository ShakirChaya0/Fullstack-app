import { useMemo, useState } from "react";
import { useDrinks } from "../hooks/useDrinks";
import FilterDrinks from "../components/drinks/filterDrinks";
import ProductsCard from "../components/ProductsCard";
import SkeletonBody from "./skeletonBody";
import { OrderList } from "../components/orderList";

function DrinksList () {
    const {isLoading, isError, drinks} = useDrinks();
    const filtros = ["Alcoholicas", "No_Alcoholicas"]
    const [query, setQuery] = useState("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value
        setQuery(query)
    }
    
    const filteredDrinks = useMemo(() => {
        return drinks?.filter((dat) => dat._name.toLowerCase().includes(query.toLowerCase())) ?? [] ;
    }, [drinks, query])

    return(
        <>
        {
            !isLoading ? (
            <section className="flex-1 grid md:grid-cols-[minmax(280px,_7fr)_4fr] lg:grid-cols-[3fr_1fr] gap-6 md:p-4 pb-6 w-full">
                <div className="border border-gray-300 rounded-2xl p-4 w-full min-w-2 shadow-2xl">
                    { !isError && <FilterDrinks handleChange={handleChange}/>}
                    { isError && <h1 className="flex w-full h-full justify-center items-center text-2xl text-red-600">Error al cargar los datos del menu</h1>}
                    { filteredDrinks.length === 0 && query.length !== 0 && !isError && <h1 className="flex justify-center items-center text-2xl text-red-600">No se ha encontrado dicho plato</h1> }
                    {
                        filtros.map((filtro) => {
                            const drinksFiltered = filteredDrinks.filter((drink) => (drink._isAlcoholic ? "Alcoholicas" : "No_Alcoholicas") === filtro)
                            if(drinksFiltered.length == 0) return null
                            return (
                                <div className="scroll-mt-55">  
                                    <span className="w-full h-0.5 bg-gray-300 block my-4" id={filtro}></span>
                                    <h2 className="max-w-4xl mx-auto text-black text-2xl">{filtro.replace("_", " ").toUpperCase()}</h2>
                                    <div className="grid grid-cols-1 col-start-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                        {
                                            drinksFiltered.map((drink) => (
                                                <ProductsCard key={drink._productId} product={drink}/>
                                            ))
                                        }
                                    </div>
                                </div>
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