import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    const [isDebouncing, setIsDebouncing] = useState(false)
    const queryClient = useQueryClient()

    useEffect(() => {
      setIsDebouncing(true)
        if(value === ""){
            setDebouncedValue(value)
            setIsDebouncing(false);
            (async () =>{
                await queryClient.invalidateQueries({queryKey: ["News"]})
            })()
            return
        }
        const handler = setTimeout( () => {
          setDebouncedValue(value)
          setIsDebouncing(false)
        }, delay)

        return () => {
          clearTimeout(handler)
        }
    }, [value, delay, queryClient])

    return {debouncedValue, isDebouncing}
}