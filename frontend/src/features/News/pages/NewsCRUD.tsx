import { useCallback, useState, type ChangeEvent } from "react";
import NewsTable from "../components/NewsTable";
import TableHeader from "../components/TableHeader";
import { useNews } from "../hooks/useNews";
import { CircularProgress, Pagination } from "@mui/material";
import { PageContext } from "../hooks/usePage";
import useDebounce from "../hooks/useDebouncer";
import { useQueryClient } from "@tanstack/react-query";
import { FilterContext } from "../hooks/useFilter";

export type FilterProps = "Todas" | "Activas"

export default function NewsCRUD () {
    const [currentPage, setPage] = useState(1)
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState<FilterProps>("Todas")
    const {debouncedValue, isDebouncing} = useDebounce(query, 400);
    const {isError, isLoading, data} = useNews(debouncedValue, filter, currentPage)
    const queryClient = useQueryClient()

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }, [setQuery])

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    const handleChangeFilter = useCallback(async (data: FilterProps) => {
        setFilter(data)
        await queryClient.invalidateQueries({queryKey: ["News"]})
    }, [setFilter, queryClient])
    
    return (
        <>
            <section className="flex flex-col items-center justify-center w-full p-4">
                <div className="flex flex-col gap-5 sm:p-16 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-300 w-full max-w-10/12">
            {
                !isLoading ? (
                            <PageContext.Provider value={currentPage}>
                                <FilterContext.Provider value={{filter: filter, handleSearch: handleSearch, isDebouncing: isDebouncing, query: query, handleChangeFilter: handleChangeFilter}}>
                                    <TableHeader/>
                                </FilterContext.Provider>
                                { !isError && ((debouncedValue.length === 0) || (data?.News.length !== 0)) && <NewsTable data={data}/> }
                                { (debouncedValue.length !== 0) && (data?.News.length === 0) && <h1 className="text-center font-medium">No se encontraron los datos buscados</h1>}
                                { isError && <p>Error</p> }
                                {
                                    !isError && data?.News.length !== 0 &&
                                    <div className="flex flex-col items-center justify-center">
                                        <Pagination count={data?.totalItems ? Math.ceil(data.totalItems / 5) : 1} shape="rounded" onChange={handleChangePage} page={currentPage}/>
                                    </div>
                                }
                            </PageContext.Provider>
                ):(
                    <div className="flex flex-col w-full items-center justify-center">
                        <CircularProgress/>
                    </div>)
            }
                </div>
            </section>
        </>
    )
}