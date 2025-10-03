import { memo, useMemo } from "react"
import type { Comida } from "../../interfaces/products"
import ProductsCard from "../ProductsCard"
import { motion, AnimatePresence } from "framer-motion"

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
          <div key={filtro} id={filtro} className="scroll-mt-55 my-10">
            <h2 className="w-full text-center font-semibold text-black text-2xl mb-5">
              {filtro.toUpperCase()}
            </h2>
            <motion.ul
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto"
              initial={false}
            >
              <AnimatePresence>
                {foodsFiltered.map((food) => (
                  <motion.li
                    key={food._productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ProductsCard product={food} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        )
      })}
    </>
  )
})

export default FoodsSpecialFilter;
