import { createContext, useContext, type ChangeEvent } from "react";
import type { FilterProps } from "../pages/NewsCRUD";

type NewsFilterContextType = {
  filter: FilterProps;
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  isDebouncing: boolean;
  query: string;
  handleChangeFilter: (data: FilterProps) => void;
};

export const FilterContext = createContext<NewsFilterContextType>({
    filter: "Todas", 
    handleSearch: () => {},
    isDebouncing: false,
    query: "",
    handleChangeFilter: () => {},
})

export const useFilter = () => useContext(FilterContext)