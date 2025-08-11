import type { Comida } from "../../interfaces/products"
import ProductsCard from "../ProductsCard"

function FoodsTypesFilter ({filteredFoods}: {filteredFoods: Comida[]}) {
    const filtrosPrincipales = ["Entrada", "Plato_Principal", "Postre"]
    
    return (
        filtrosPrincipales.map((filtro) => {
            const foodsFiltered = filteredFoods.filter((food) => food._type === filtro)
            if(foodsFiltered.length === 0) return null

            return (
                <div id={filtro} key={filtro} className="scroll-mt-55">  
                    <span className="w-full h-0.5 bg-gray-300 block my-4"></span>
                    <h2 className="max-w-4xl mx-auto text-black text-2xl">{filtro.replace("_", " ").toUpperCase()}</h2>
                    <div className="grid grid-cols-1 col-start-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {
                            foodsFiltered.map((food) => (
                                <ProductsCard key={food._productId} product={food}/>
                            ))
                        }
                    </div>
                </div>
            )
        })
    )
}

export default FoodsTypesFilter