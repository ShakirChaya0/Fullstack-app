import { createContext, useContext, type ChangeEvent } from "react";

type WaiterSearchContextType = {
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  isDebouncing: boolean;
  query: string;
};

export const SearchContext = createContext<WaiterSearchContextType>({
    handleSearch: () => {},
    isDebouncing: false,
    query: "",
})

export const useSearchProvider = () => useContext(SearchContext)