import { useMemo } from "react";
import type { Bebida } from "../../interfaces/products";
import ProductsCard from "../ProductsCard";

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
          <div key={filtro} id={filtro} className="scroll-mt-55">
            <span className="w-full h-0.5 bg-gray-300 block my-4"></span>
            <h2 className="max-w-4xl mx-auto text-black text-2xl">
              {filtro.replace("_", " ").toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 col-start-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {drinksFiltered.map((drink) => (
                <ProductsCard key={drink._productId} product={drink} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}