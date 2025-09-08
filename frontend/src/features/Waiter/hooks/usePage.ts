import { createContext, useContext } from "react"

export const PageContext = createContext({currentPage: 1, query: ""})

export const usePage = () => useContext(PageContext)