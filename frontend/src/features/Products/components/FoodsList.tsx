import { useMemo, useState } from "react";
import { useFoods } from "../hooks/useFoods";
import FilterProducts from "./filterFoods";
import ProductsCard from "./ProductsCard";

function FoodsList () {
    const foods = useFoods();
    const pedidos = false
    const filtros = ["Entrada", "Plato_Principal", "Postre"]
    const [query, setQuery] = useState<string>("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value
        setQuery(query)
    }

    const filteredFoods = useMemo(() => {
        return foods.filter((food) => food._name.includes(query))
    }, [foods, query])

    return(
        <>
            <section className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 p-4 w-full">
                <div className="border border-gray-300 rounded-2xl p-4">
                    <FilterProducts handleChange={handleChange}/>
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
                <aside className="grid col-start-2 border p-4 border-gray-300 h-100 rounded-2xl">
                    <h1 className="text-center text-2xl">Mi Pedido</h1>
                    {!pedidos && <img src="../assets/empty-order.svg" alt="asjdbaksd"/>}
                </aside>
            </section>
        </>
    )
}

export default FoodsList