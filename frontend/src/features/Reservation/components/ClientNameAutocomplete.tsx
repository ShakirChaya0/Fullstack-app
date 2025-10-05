import { useState } from "react";
import useApiClient from "../../../shared/hooks/useApiClient";


export default function ClientAutocompleted() {
    const [inputValue, setInputValue] = useState("");
    const { apiCall } = useApiClient(); 

    const { data: options = [], isLoading } = useQuery({
        queryKey: ["reservations", inputValue],
        queryFn: () => searchClient(apiCall, inputValue),
        enabled: inputValue.length > 1,
    });



}