import { memo, useMemo } from "react"
import type { Comida } from "../../interfaces/products"
import ProductsCard from "../ProductsCard"

type Props = {
  filteredFoods: Comida[]
}

const FoodsTypesFilter = memo(({ filteredFoods }: Props) => {
  const filtrosPrincipales = ["Entrada", "Plato_Principal", "Postre"] as const

  const groupedFoods = useMemo(() => {
    const groups: Record<typeof filtrosPrincipales[number], Comida[]> = {
      Entrada: [],
      Plato_Principal: [],
      Postre: [],
    }

    for (const food of filteredFoods) {
      if (groups[food._type as keyof typeof groups]) {
        groups[food._type as keyof typeof groups].push(food)
      }
    }

    return groups
  }, [filteredFoods])

  return (
    <>
      {filtrosPrincipales.map((filtro) => {
        const foodsFiltered = groupedFoods[filtro]
        if (foodsFiltered.length === 0) return null

        return (
          <div id={filtro} key={filtro} className="scroll-mt-55">
            <span className="w-full h-0.5 bg-gray-300 block my-4"></span>
            <h2 className="max-w-4xl mx-auto text-black text-2xl">
              {filtro.replace("_", " ").toUpperCase()}
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

export default FoodsTypesFilter;