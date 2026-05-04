import { lazy, Suspense, useMemo, useState } from "react"
import { useDrinks } from "../hooks/useDrinks"
import FilterDrinks from "../components/drinks/filterDrinks"
import SkeletonBody from "./skeletonBody"
import { OrderList } from "../components/orderList"
import SuggestionsList from "../components/SuggestionsList"
import SuggestionSkeleton from "../components/SuggestionSkeleton"
import { Alert } from "@mui/material"
const FilteredDrinks = lazy(() => import("../components/drinks/FilteredDrinks"))
import { useOrderUpdateHandler } from "../../Order/hooks/useOrderUpdateHandler"

function DrinksList() {
  const { isLoading, isError, drinks } = useDrinks()
  const [query, setQuery] = useState("")

  useOrderUpdateHandler()
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value)
  }

  const filteredDrinksAux = useMemo(() => {
    return (
      drinks?.filter((dat) =>
        dat._name.toLowerCase().includes(query.toLowerCase())
      ) ?? []
    )
  }, [drinks, query])

  const filteredDrinks = filteredDrinksAux.filter((drink) => drink._state === 'Disponible');

  return (
    <>
      <section className="flex-1 md:p-4 pb-6 w-full h-full overflow-y-auto">
        <div className="border border-gray-300 rounded-2xl p-4 w-full min-w-2 shadow-2xl">
          {!isError && <FilterDrinks handleChange={handleChange} />}
          <Suspense fallback={<SuggestionSkeleton/>}>
            <SuggestionsList/>
          </Suspense>
          {isError && (
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
          {filteredDrinks.length === 0 && query.length !== 0 && !isError && (
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