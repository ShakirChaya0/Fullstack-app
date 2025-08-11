import type { Comida } from "../../interfaces/products";
import ProductsCard from "../ProductsCard";

function FoodsSpecialFilter({ filteredFoods }: { filteredFoods: Comida[] }) {
  const filtrosEspeciales = ["Vegetariana", "Vegana", "Celiaca"];
  
  return (
    <>
      {filtrosEspeciales.map((filtro) => {
        let foodsFiltered: Comida[] = [];

        if (filtro === "Vegetariana") {
          foodsFiltered = filteredFoods.filter(food => food._isVegetarian);
        } 
        else if (filtro === "Vegana") {
          foodsFiltered = filteredFoods.filter(food => food._isVegan);
        } 
        else if (filtro === "Celiaca") {
          foodsFiltered = filteredFoods.filter(food => food._isGlutenFree);
        }

        if (foodsFiltered.length === 0) return null;

        return (
          <div key={filtro} id={filtro} className="scroll-mt-55">  
            <span className="w-full h-0.5 bg-gray-300 block my-4"></span>
            <h2 className="max-w-4xl mx-auto text-black text-2xl">{filtro.toUpperCase()}</h2>
            <div className="grid grid-cols-1 col-start-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {foodsFiltered.map((food) => (
                <ProductsCard key={food._productId} product={food}/>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default FoodsSpecialFilter;
