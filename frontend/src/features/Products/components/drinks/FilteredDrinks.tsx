import { useMemo } from "react";
import type { Bebida } from "../../interfaces/products"
import ProductsCard from "../ProductsCard"
import { motion, AnimatePresence } from "framer-motion"

export default function FilteredDrinks({filteredDrinks}: {filteredDrinks: Bebida[]}) {
  const groupedDrinks = useMemo(() => {
    const groups = {
      Alcoholicas: [] as typeof filteredDrinks,
      No_Alcoholicas: [] as typeof filteredDrinks,
    };

    for (const drink of filteredDrinks) {
      if (drink._isAlcoholic) {
        groups.Alcoholicas.push(drink);
      } else {
        groups.No_Alcoholicas.push(drink);
      }
    }

    return groups;
  }, [filteredDrinks]);

  return (
    <>
      {(["Alcoholicas", "No_Alcoholicas"] as const).map((filtro) => {
        const drinksFiltered = groupedDrinks[filtro];
        if (drinksFiltered.length === 0) return null;

        return (
          <div key={filtro} id={filtro} className="scroll-mt-55 my-10">
            <h2 className="w-full text-center font-semibold text-black text-2xl mb-5">
              {filtro.replace("_", " ").toUpperCase()}
            </h2>
            <motion.ul
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto"
              initial={false}
            >
              <AnimatePresence>
                {drinksFiltered.map((drink) => (
                  <motion.li
                    key={drink._productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ProductsCard key={drink._productId} product={drink} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        );
      })}
    </>
  );
}