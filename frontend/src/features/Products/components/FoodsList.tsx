import { useMemo, useState } from "react";
import { useFoods } from "../hooks/useFoods";
import FilterProducts from "./filterFoods";
import ProductsCard from "./ProductsCard";
import { SkeletonBody } from "./skeletonBody";
import { OrderList } from "./orderList";

function FoodsList () {
    const {isLoading, isError, foods} = useFoods();
    const filtros = ["Entrada", "Plato_Principal", "Postre"]
    const [query, setQuery] = useState<string>("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value
        setQuery(query)
    }

    const filteredFoods = useMemo(() => {
        return foods?.filter((food) => food._name.includes(query)) ?? [];
    }, [foods, query])

    return(
        <>
        {
            !isLoading ? (
                <section className="flex-1 grid md:grid-cols-[minmax(280px,_3fr)_1fr] gap-6 p-4 w-full">
                <div className="border border-gray-300 rounded-2xl p-4 w-full min-w-2">
                    { !isError && <FilterProducts handleChange={handleChange}/>}
                    { isError && <h1 className="flex w-full h-full justify-center items-center text-2xl text-red-600">Error al cargar los datos del menu</h1>}
                    {
                        filtros.map((filtro) => {
                            const foodsFiltered = filteredFoods.map((food) => food._type == filtro)
                            if(foodsFiltered.length == 0) return null
                            return (
                                <>  
                                    <span className="w-full h-0.5 bg-gray-300 block my-4" id={filtro}></span>
                                    <h2 className="max-w-4xl mx-auto text-black text-2xl">{filtro.replace("_", "").toUpperCase()}</h2>
                                    <div className="grid grid-cols-1 col-start-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                        {
                                            filteredFoods.map((food) => (
                                                <ProductsCard key={food._productId} food={food}/>
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
            ) : 
            (<SkeletonBody/>)
        }

        </>
    )
}

export default FoodsList