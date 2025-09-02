import { useState } from "react"
import EntitySelector from "../components/EntitySelector"
import useEntity from "../hooks/useEntity"
import EntityTable from "../components/EntityForm"

export type EntityState = "Policy" | "Information"

export default function Institution() {
    const [entity, setEntity] = useState<EntityState>("Policy")  
    const [isError, isLoading, data] = useEntity(entity)
    
    return(
        <section className="flex flex-col items-center w-full sm:p-4 gap-6 sm:py-8">
            <EntitySelector/>
            <div className="flex flex-col gap-5 sm:p-16 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-300 w-full max-w-7xl">
            </div>
            {/* <EntityForm entity={entity}/> */}
        </section>
    )
}