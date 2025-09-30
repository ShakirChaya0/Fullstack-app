import { useState } from "react"
import EntitySelector from "../components/EntitySelector"
import useEntity from "../hooks/useEntity"
import PolicyForm from "../components/PolicyForm"
import InformationForm from "../components/InformationForm"
import type Policy from "../interfaces/Policy"
import type Information from "../interfaces/Information"
import { fetchPolicy } from "../services/fetchPolicy"
import { fetchInformation } from "../services/fetchInformation"

export type EntityState = "Policy" | "Information"

export default function Institution() {
    const [entity, setEntity] = useState<EntityState>("Policy")  
    const [isError, isLoading, data] = useEntity<Policy | Information>(
        entity === "Policy" ? "Policy" : "Information",
        entity === "Policy" ? fetchPolicy : fetchInformation
    );
    
    return(
        <section className="flex flex-col items-center w-full sm:p-4 gap-6 sm:py-8">
            <EntitySelector entity={entity} setEntity={setEntity} />
            {isLoading && <div>Cargando...</div>}
            {isError && <div>Error al cargar los datos</div>}
            {!isLoading && !isError && (
                <>
                    {entity === "Policy" && <PolicyForm data={data as Policy} />}
                    {entity === "Information" && <InformationForm data={data as Information} />}
                </>
            )}
        </section>
    )
}