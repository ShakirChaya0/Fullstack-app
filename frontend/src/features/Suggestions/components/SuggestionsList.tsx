import { motion, AnimatePresence } from "framer-motion";
import type { Suggestion } from "../interfaces/Suggestion";
import SuggestionCard from "./SuggestionCard";

export default function SuggestionsList({ suggestions }: { suggestions: Suggestion[] }) {
    return (
        <motion.ul
            layout
            className="flex flex-row flex-wrap justify-center gap-6 p-2"
            initial={false}
        >
            <AnimatePresence>
                {suggestions.map((sugg) => (
                    <motion.li
                        key={`${sugg._product._productId}-${sugg._dateFrom}-${sugg._dateTo}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <SuggestionCard suggestion={sugg} />
                    </motion.li>
                ))}
            </AnimatePresence>
        </motion.ul>
    );
}
