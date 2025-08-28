import { useState } from "react";
import NewsTable from "../components/NewsTable";
import TableHeader from "../components/TableHeader";
import { useNews } from "../hooks/useNews";
import SkeletonNewsBody from "./SkeletonNewsBody";
import { Pagination } from "@mui/material";

/* Lo ideal no seria hacer prop drilling con la currentPage, hay que hacer un contexto */ 

export default function NewsCRUD () {
    const [currentPage, setPage] = useState(1)
    const {isError, isLoading, data} = useNews(currentPage)

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }
    
    return (
        <>
            {
                !isLoading ? (
                    <section className="flex flex-col items-center justify-center w-full p-4">
                        <div className="flex flex-col gap-5 sm:p-16 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-300 w-full max-w-7xl">
                            <TableHeader currentPage={currentPage}/>
                            { !isError && <NewsTable data={data} currentPage={currentPage}/> }
                            { isError && <p>Error</p> }
                            <div className="flex flex-col items-center justify-center">
                                <Pagination count={data?.pages} shape="rounded" onChange={handleChangePage} page={currentPage}/>
                            </div>
                        </div>
                    </section>
                ):(<SkeletonNewsBody/>)
            }
        </>
    )
}