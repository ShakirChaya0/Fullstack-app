import type { Suggestion } from "../interfaces/Suggestion";
import SuggestionCard from "./SuggestionCard";

export default function SuggestionsList({ suggestions }: { suggestions: Suggestion[] }) {
    return (
        <ul className="flex flex-col gap-6">
            {suggestions.map(sugg => (
                <li key={`${sugg._product._productId}-${sugg._dateFrom}`}>
                    <SuggestionCard suggestion={sugg} />
                </li>
            ))}
        </ul>
    )
}