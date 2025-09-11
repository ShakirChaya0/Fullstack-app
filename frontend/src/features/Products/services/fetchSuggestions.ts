export default async function fetchSuggestions () {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sugerencias?filter=ACTIVES`)
    if (!response.ok) throw new Error("Error al conseguir los datos")

    const data = await response.json()
    return data
} 