import { lazy, Suspense, useCallback, useState, type ChangeEvent } from "react"
import { useWaiters } from "../hooks/useWaiters"
import { CircularProgress, Pagination } from "@mui/material"
import SkeletonBodyWaiters from "./SkeletonBodyWaiters"
import WaitersHeader from "../components/WaitersHeader"
import { PageContext } from "../hooks/usePage"
import useDebounce from "../hooks/useDebounce"
import { SearchContext } from "../hooks/useSearchProvider"
const WaitersTable = lazy(() => import("../components/WaitersTable"))

export default function WaitersCRUD () {
    const [currentPage, setPage] = useState(1)
    const [query, setQuery] = useState("")
    const {debouncedValue, isDebouncing} = useDebounce(query, 400);
    const { isLoading, isError, data } = useWaiters(debouncedValue.trim(), currentPage)
    
    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    const handleResetPage = useCallback((value: number) => {
        setPage(value)
    }, [setPage])

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    },[setQuery])
    
    return(
        <>
            <section className="flex flex-col items-center justify-center w-full p-4 min-h-[600px]">
                <div className="flex flex-col gap-5 sm:p-16 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-300 w-full max-w-[1600px] min-h-[600px]">
                    <PageContext.Provider value={{currentPage: currentPage, query: debouncedValue}}>
                        <SearchContext.Provider value={{ query: query, handleSearch: handleSearch, isDebouncing: isDebouncing}}>
                            <WaitersHeader/>
                        </SearchContext.Provider>
                        {
                            !isLoading ? (
                                <>
                                    {!isError && ((debouncedValue.length === 0) || (data?.Waiters.length !== 0)) && 
                                        <Suspense fallback={<SkeletonBodyWaiters/>}>
                                            <WaitersTable waiters={data} handleResetPage={handleResetPage}/>
                                        </Suspense> 
                                    }
                                    { (debouncedValue.length !== 0) && (data?.Waiters.length === 0) && 
                                        <div className="flex justify-center items-center h-full w-full">
                                            <h1 className="font-medium">No se encontraron los datos buscados</h1>
                                        </div>
                                    }
                                    { isError && <p>Error al cargar los datos</p>}
                                    {
                                        !isError && data?.totalItems !== 0 &&
                                        <div className="flex flex-col items-center justify-center">
                                            <Pagination count={data?.totalItems ? Math.ceil(data.totalItems / 5) : 1} shape="rounded" onChange={handleChangePage} page={currentPage}/>
                                        </div>
                                    }
                                </>
                            ) : (
                                <div className="flex flex-col w-full items-center justify-center min-h-120">
                                    <CircularProgress/>
                                </div>
                            )
                        }
                    </PageContext.Provider>
                </div>   
            </section>
        </>
    )
}