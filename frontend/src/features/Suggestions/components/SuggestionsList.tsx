import type { Suggestion } from "../interfaces/Suggestion";
import SuggestionCard from "./SuggestionCard";

export default function SuggestionsList({ suggestions }: { suggestions: Suggestion[] }) {
    return (
        <ul className="flex flex-row flex-wrap justify-center gap-6 p-2">
            {suggestions.map(sugg => (
                <li key={`${sugg._product._productId}-${sugg._dateFrom}`}>
                    <SuggestionCard suggestion={sugg} />
                </li>
            ))}
        </ul>
    )
}