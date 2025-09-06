import { memo, useMemo } from "react"
import type { Comida } from "../../interfaces/products"
import ProductsCard from "../ProductsCard"

type Props = {
  filteredFoods: Comida[]
}

const FoodsSpecialFilter = memo(({ filteredFoods }: Props) => {
  const groupedFoods = useMemo(() => {
    const groups: Record<string, Comida[]> = {
      Vegetariana: [],
      Vegana: [],
      Celiaca: [],
    }

    for (const food of filteredFoods) {
      if (food._isVegetarian) groups.Vegetariana.push(food)
      if (food._isVegan) groups.Vegana.push(food)
      if (food._isGlutenFree) groups.Celiaca.push(food)
    }

    return groups
  }, [filteredFoods])

  const filtrosEspeciales: (keyof typeof groupedFoods)[] = [
    "Vegetariana",
    "Vegana",
    "Celiaca",
  ]

  return (
    <>
      {filtrosEspeciales.map((filtro) => {
        const foodsFiltered = groupedFoods[filtro]
        if (foodsFiltered.length === 0) return null

        return (
          <div key={filtro} id={filtro} className="scroll-mt-55">
            <span className="w-full h-0.5 bg-gray-300 block my-4"></span>
            <h2 className="max-w-4xl mx-auto text-black text-2xl">
              {filtro.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 col-start-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {foodsFiltered.map((food) => (
                <ProductsCard key={food._productId} product={food} />
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
})

export default FoodsSpecialFilter;
