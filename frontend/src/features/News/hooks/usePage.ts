import { createContext, useContext } from "react"

export const PageContext = createContext(1)

export const usePage = () => useContext(PageContext)