import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import KitchenMainLayout from "../shared/components/KitchenMainLayout";
import SuggestionSkeletonBody from "../features/Suggestions/pages/SuggestionSkeletonBody";
const SuggestionsPage = lazy(() => import("../features/Suggestions/pages/SuggestionsPage"))

export function KitchenRouter() {
  return (
    <Routes>
      <Route element={<KitchenMainLayout/>}>
        <Route path="/Cocina" element={<h1>Hola cocina</h1>}/>
        <Route path="/Cocina/Sugerencias" element={
          <Suspense fallback={<SuggestionSkeletonBody/>}>
            <SuggestionsPage/>
          </Suspense>}
        />
        <Route path="/Cocina/Pedidos"/>
      </Route>
    </Routes>
  );
}