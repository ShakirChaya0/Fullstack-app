import NewsTable from "../components/NewsTable";
import TableHeader from "../components/TableHeader";
import { useNews } from "../hooks/useNews";


export default function NewsCRUD () {
    const {isError, isLoading} = useNews()
    return (
        <>
            {
                !isLoading ? (
                    <section className="flex flex-col items-center justify-center w-full p-4">
                        <div className="flex flex-col gap-5 sm:p-16 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-300 w-full max-w-7xl">
                            <TableHeader/>
                            { !isError && <NewsTable/> }
                            { isError && <p>Error</p> }
                        </div>
                    </section>
                ):(<></>)
                
            }
        </>
    )
}