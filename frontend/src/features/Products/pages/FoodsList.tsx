import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useFoods } from "../hooks/useFoods";
import FilterProducts from "../components/foods/filterFoods";
import SkeletonBody from "./skeletonBody";
import { OrderList } from "../components/orderList";
import SuggestionsList from "../components/SuggestionsList";
import SuggestionSkeleton from "../components/SuggestionSkeleton";
const FoodsTypesFilter = lazy(() => import("../components/foods/FoodsTypesFilter"))
const FoodsSpecialFilter = lazy(() => import("../components/foods/FoodsSpecialFilter"))

function FoodsList () {
    const {isLoading, isError, foods} = useFoods()
    const [query, setQuery] = useState<string>("")


    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value
        setQuery(query)
    }, [])

    const filteredFoods = useMemo(() => {
        return foods?.filter((food) => food._name.toLowerCase().includes(query.toLowerCase())) ?? [];
    }, [foods, query])

    return(
        <>
            <section className="flex-1 md:p-4 pb-6 w-full h-full">
              <div className="border border-gray-300 rounded-2xl p-4 w-full min-w-2 shadow-2xl">
                { !isError && <FilterProducts handleChange={handleChange} /> }
                <Suspense fallback={<SuggestionSkeleton/>}>
                  <SuggestionsList/>
                </Suspense>
                {
                  !isLoading ? (
                    <>
                      { isError && (
                        <h1 className="flex w-full h-full justify-center items-center text-2xl text-red-600">
                          Error al cargar los datos del menú
                        </h1>
                      )}
                      { filteredFoods.length === 0 && query.length !== 0 && !isError && (
                        <h1 className="flex justify-center items-center text-2xl text-red-600">
                          No se ha encontrado dicho plato
                        </h1>
                      )}
                      <Suspense fallback={<SkeletonBody/>}>
                        <FoodsTypesFilter filteredFoods={filteredFoods} />
                      </Suspense>
                      <Suspense fallback={<SkeletonBody/>}>
                        <FoodsSpecialFilter filteredFoods={filteredFoods} />
                      </Suspense>
                    </>
                  ) : (
                    <SkeletonBody />
                  )
                }
              </div>
              <OrderList />
            </section>
        </>
    )
}

export default FoodsList