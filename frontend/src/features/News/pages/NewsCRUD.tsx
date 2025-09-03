import { useEffect, useState } from "react";
import { NewsTable } from "../components/NewsTable";
import TableHeader from "../components/TableHeader";
import { useNews } from "../hooks/useNews";
import { CircularProgress, Pagination } from "@mui/material";
import { PageContext } from "../hooks/usePage";

export default function NewsCRUD () {
    const [currentPage, setPage] = useState(1)
    const {isError, isLoading, data} = useNews(currentPage)

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }
    
    useEffect(() => {
        if (data?.totalItems) {
        const totalPages = Math.ceil(data.totalItems / 5)
            if (currentPage > totalPages) {
                setPage(totalPages)
            }
        }
    }, [data?.totalItems, currentPage])

    return (
        <>
            {
                !isLoading ? (
                    <section className="flex flex-col items-center justify-center w-full p-4">
                        <div className="flex flex-col gap-5 sm:p-16 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-300 w-full max-w-7xl">
                            <PageContext.Provider value={currentPage}>
                                <TableHeader />
                                { !isError && <NewsTable data={data}/> }
                                { isError && <p>Error</p> }
                                {
                                    !isError &&
                                    <div className="flex flex-col items-center justify-center">
                                        <Pagination count={data?.totalItems ? Math.ceil(data.totalItems / 5) : 1} shape="rounded" onChange={handleChangePage} page={currentPage}/>
                                    </div>
                                }
                            </PageContext.Provider>
                        </div>
                    </section>
                ):(
                <div className="flex flex-col w-full items-center justify-center">
                    <CircularProgress/>
                </div>)
            }
        </>
    )
}