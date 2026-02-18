import { createContext, useContext } from "react"
import type { FilterProps } from "../pages/NewsCRUD"

type Props = {
    currentPage: number,
    query: string,
    filter: FilterProps
}

export const PageContext = createContext<Props>({currentPage: 1, query: "", filter: "Todas"})

export const usePage = () => useContext(PageContext)