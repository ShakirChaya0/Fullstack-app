import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useFoods } from "../hooks/useFoods";
import FilterProducts from "../components/foods/filterFoods";
import SkeletonBody from "./skeletonBody";
import { OrderList } from "../components/orderList";
import SuggestionsList from "../components/SuggestionsList";
import SuggestionSkeleton from "../components/SuggestionSkeleton";
import { Alert } from "@mui/material";
import { useOrderUpdateHandler } from "../../Order/hooks/useOrderUpdateHandler";
const FoodsTypesFilter = lazy(() => import("../components/foods/FoodsTypesFilter"))
const FoodsSpecialFilter = lazy(() => import("../components/foods/FoodsSpecialFilter"))

function FoodsList () {
    const {isLoading, isError, foods} = useFoods()
    const [query, setQuery] = useState<string>("")
    useOrderUpdateHandler()
      
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value
        setQuery(query)
    }, [])

    const filteredFoods = useMemo(() => {
        return foods?.filter((food) => food._name.toLowerCase().includes(query.toLowerCase())) ?? [];
    }, [foods, query])

    return(
        <>
            <section className="flex-1 md:p-4 pb-6 w-full h-full overflow-y-auto">
              <div className="border border-gray-300 rounded-2xl p-4 w-full min-w-2 shadow-2xl">
                { !isError && <FilterProducts handleChange={handleChange} /> }
                <Suspense fallback={<SuggestionSkeleton/>}>
                  <SuggestionsList/>
                </Suspense>
                {
                  !isLoading ? (
                    <>
                      { isError && (
                        <Alert
                          severity="error"
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '2rem 2rem 0.5rem 2rem'
                          }}
                        >
                          Error al cargar los datos del menú
                        </Alert>
                      )}
                      { filteredFoods.length === 0 && query.length !== 0 && !isError && (
                        <Alert
                          severity="error"
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '2rem 2rem 0.5rem 2rem'
                          }}
                        >
                          No se ha encontrado dicho plato
                        </Alert>
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