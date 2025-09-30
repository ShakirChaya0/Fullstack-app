import { lazy, Suspense, useMemo, useState } from "react"
import { useDrinks } from "../hooks/useDrinks"
import FilterDrinks from "../components/drinks/filterDrinks"
import SkeletonBody from "./skeletonBody"
import { OrderList } from "../components/orderList"
import SuggestionsList from "../components/SuggestionsList"
import SuggestionSkeleton from "../components/SuggestionSkeleton"
const FilteredDrinks = lazy(() => import("../components/drinks/FilteredDrinks"))

function DrinksList() {
  const { isLoading, isError, drinks } = useDrinks()
  const [query, setQuery] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value)
  }

  const filteredDrinks = useMemo(() => {
    return (
      drinks?.filter((dat) =>
        dat._name.toLowerCase().includes(query.toLowerCase())
      ) ?? []
    )
  }, [drinks, query])

  return (
    <>
      <section className="flex-1 md:p-4 pb-6 w-full h-full">
        <div className="border border-gray-300 rounded-2xl p-4 w-full min-w-2 shadow-2xl">
          {!isError && <FilterDrinks handleChange={handleChange} />}
          <Suspense fallback={<SuggestionSkeleton/>}>
            <SuggestionsList/>
          </Suspense>
          {isError && (
            <h1 className="flex w-full h-full justify-center items-center text-2xl text-red-600">
              Error al cargar los datos del menú
            </h1>
          )}
          {filteredDrinks.length === 0 && query.length !== 0 && !isError && (
            <h1 className="flex justify-center items-center text-2xl text-red-600">
              No se ha encontrado dicha bebida
            </h1>
          )}

          {!isLoading ? (
            <Suspense fallback={<SkeletonBody/>}>
              <FilteredDrinks filteredDrinks={filteredDrinks} />
            </Suspense>
          ) : (
            <SkeletonBody />
          )}
        </div>
        <OrderList />
      </section>
    </>
  )
}

export default DrinksList;