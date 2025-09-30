import { lazy, Suspense, useCallback, useState, type ChangeEvent } from "react";
import TableHeader from "../components/TableHeader";
import { useNews } from "../hooks/useNews";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import { PageContext } from "../hooks/usePage";
import useDebounce from "../hooks/useDebouncer";
import { useQueryClient } from "@tanstack/react-query";
import { FilterContext } from "../hooks/useFilter";
import SkeletonNewsBody from "./SkeletonNewsBody";
const NewsTable = lazy(() => import("../components/NewsTable"))

export type FilterProps = "Todas" | "Activas"

export default function NewsCRUD () {
    const [currentPage, setPage] = useState(1)
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState<FilterProps>("Todas")
    const {debouncedValue, isDebouncing} = useDebounce(query, 400);
    const {isError, isLoading, data} = useNews(debouncedValue.trim(), filter, currentPage)
    const queryClient = useQueryClient()

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    },[setQuery])

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    const handleResetPage = useCallback((value: number) => {
        setPage(value)
    }, [setPage])

    const handleChangeFilter = useCallback(async (data: FilterProps) => {
        setPage(1)
        setFilter(data)
        await queryClient.invalidateQueries({queryKey: ["News"]})
    }, [setPage, setFilter, queryClient])
    
    return (
        <>
            <section className="flex flex-col items-center justify-center w-full p-4 min-h-[600px]">
                <div className="flex flex-col bg-[var(--admin-bg-200)] gap-5 sm:p-16 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-300 w-full max-w-[1600px] min-h-[600px]">
                    <PageContext.Provider value={{currentPage: currentPage, query: debouncedValue, filter: filter}}>
                        <FilterContext.Provider value={{filter: filter, handleSearch: handleSearch, isDebouncing: isDebouncing, query: query, handleChangeFilter: handleChangeFilter}}>
                            <TableHeader/>
                        </FilterContext.Provider>
            {
                !isLoading ? (
                    <>
                        { !isError && ((debouncedValue.length === 0) || (data?.News.length !== 0)) && 
                            <Suspense fallback={<SkeletonNewsBody/>}>
                                <NewsTable data={data} handleResetPage={handleResetPage}/> 
                            </Suspense>
                        
                        }
                        { (debouncedValue.length !== 0) && (data?.News.length === 0) && 
                            <div className="flex items-center w-full h-full justify-center">
                                <h1 className="font-medium">No se encontraron los datos buscados</h1>
                            </div>
                        }
                        { isError && <p>Error</p> }
                        {
                            !isError && data?.totalItems !== 0 &&
                            <div className="flex flex-col items-center justify-center">
                                <Pagination count={data?.totalItems ? Math.ceil(data.totalItems / 5) : 1} shape="rounded" onChange={handleChangePage} page={currentPage}/>
                            </div>
                        }
                    </>
                    ):(
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