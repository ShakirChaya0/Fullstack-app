import { useState } from "react";
import ReservationForm from "../components/ReservationForm";


export default function ReservationCRUD() {

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleError = (message: string | null) => setErrorMessage(message); 

    return (
        <main>
            <ReservationForm onError={handleError} />
            {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
        </main>
    )
}